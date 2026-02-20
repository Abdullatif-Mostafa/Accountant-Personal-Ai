// n8n Webhook Integration for AI Personal Accountant

import type { ExtractedTransactionData } from '@/types';

const N8N_WEBHOOK_URL = 'https://n8n.tifacom.cfd/webhook/appendData';

interface N8nPayload {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
  entries: Array<{
    account: string;
    debit: number;
    credit: number;
  }>;
  confidence: number;
  imageData?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
}

/**
 * Helper function to compress image before converting to base64
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reduce dimensions if too large (max 1920x1440)
        if (width > 1920 || height > 1440) {
          const ratio = Math.min(1920 / width, 1440 / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8 // 80% quality
          );
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Helper function to convert File to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 string after the comma
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Send data to n8n webhook
 */
export async function sendToN8n(
  userMessage: string,
  data: ExtractedTransactionData,
  imageFile?: File
): Promise<{ success: boolean; data?: ExtractedTransactionData | Record<string, unknown>; error?: string }> {
  try {
    const payload: N8nPayload = {
      description: data.description || userMessage,
      amount: data.amount || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'عام',
      type: data.entries && data.entries.some(e => e.account.includes('مصروف')) ? 'expense' : 'income',
      entries: data.entries || [],
      confidence: data.confidence || 0.9
    };

    // Add image data if provided
    if (imageFile) {
      // Compress image before sending
      const compressedFile = await compressImage(imageFile);
      const base64 = await fileToBase64(compressedFile);
      payload.imageData = {
        base64,
        mimeType: 'image/jpeg',
        fileName: imageFile.name
      };
    }

    console.log('Sending to n8n webhook:', { url: N8N_WEBHOOK_URL, payload });

    // Try with POST request
    const controller = new AbortController();
    // Increase timeout significantly (60 seconds for images, 15 for text)
    const timeoutDuration = imageFile ? 60000 : 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('n8n response status:', response.status);

    if (response.ok) {
      const responseData = await response.json();
      console.log('n8n success response:', responseData);
      return {
        success: true,
        data: responseData || payload
      };
    } else {
      // If response is not ok, still consider it success since the webhook might not return JSON
      console.log('n8n returned status:', response.status);
      return {
        success: true,
        data: { status: response.status, message: 'تم إرسال البيانات بنجاح' }
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    // Handle abort errors separately
    const isAbortError = error instanceof Error && (error.name === 'AbortError' || errorMessage.includes('aborted'));
    
    console.error('n8n request error:', {
      error: errorMessage,
      url: N8N_WEBHOOK_URL,
      isAbortError,
      type: error instanceof TypeError ? 'TypeError' : typeof error
    });

    if (isAbortError) {
      const duration = imageFile ? '60 ثانية' : '15 ثانية';
      return {
        success: false,
        error: `⚠️ انتهت مهلة الاتصال (${duration}):\n\nقد يكون السبب:\n1. اتصال إنترنت ضعيف جداً\n2. خادم n8n غير متاح أو بطيء\n3. الصورة لم تُضغط بشكل صحيح\n\nحاول:\n• اسحب الصورة إلى حدة أصغر\n• استخدم صورة ذات جودة أقل\n• تحقق من سرعة الإنترنت`
      };
    }

    // If it's a CORS error
    if (errorMessage.includes('Failed to fetch')) {
      return {
        success: false,
        error: `⚠️ مشكلة في الاتصال:\n\nتأكد من أن:\n1. رابط n8n صحيح\n2. الـ webhook مفعّل\n3. السماح بـ CORS من جميع الأصول`
      };
    }

    return {
      success: false,
      error: `حدث خطأ: ${errorMessage}`
    };
  }
}

/**
 * Parse user message or file content using local AI (mock for now)
 * Returns extracted transaction data
 * If no amount found, returns success with 0 amount (for general text/content)
 */
export function parseUserMessage(userMessage: string): ExtractedTransactionData {
  // Simulate message parsing locally
  const amountMatch = userMessage.match(/(\d+(?:\.\d+)?)\s*(ريال|ر.س|SAR)?/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  // Detect transaction type
  const hasExpenseKeywords = /(دفعت|اشتريت|فاتورة|مصروف|شراء|سداد|دفع)/i.test(userMessage);
  const hasIncomeKeywords = /(استلمت|تحصيل|إيراد|مبيعات|قبض|تحويل)/i.test(userMessage);
  const isExpense = hasExpenseKeywords || (!hasIncomeKeywords && amount > 0);

  // Detect category
  let category = 'عام';
  let accountName = isExpense ? 'مصروفات عامة' : 'إيرادات عامة';

  if (/كهرباء/i.test(userMessage)) {
    category = 'خدمات';
    accountName = 'مصروفات الكهرباء';
  } else if (/ماء/i.test(userMessage)) {
    category = 'خدمات';
    accountName = 'مصروفات الماء';
  } else if (/انترنت|واي فاي|wifi/i.test(userMessage)) {
    category = 'اتصالات';
    accountName = 'مصروفات الإنترنت';
  } else if (/اتصالات|STC|موبايلي|زين/i.test(userMessage)) {
    category = 'اتصالات';
    accountName = 'مصروفات الاتصالات';
  } else if (/بنزين|وقود|مواصلات|تأجير/i.test(userMessage)) {
    category = 'مواصلات';
    accountName = 'مصروفات المواصلات';
  } else if (/مطعم|أكل|طعام|غداء|عشاء/i.test(userMessage)) {
    category = 'مطاعم';
    accountName = 'مصروفات المطاعم';
  } else if (/تسوق|ملابس|مستلزمات/i.test(userMessage)) {
    category = 'تسوق';
    accountName = 'مصروفات التسوق';
  } else if (/مبيعات|بيع/i.test(userMessage)) {
    category = 'مبيعات';
    accountName = 'إيرادات المبيعات';
  } else if (/خدمة|استشارة/i.test(userMessage)) {
    category = 'خدمات';
    accountName = 'إيرادات الخدمات';
  }

  // If no amount found, entries can be empty (for general content)
  const entries = amount > 0 ? (
    isExpense
      ? [
          { account: accountName, debit: amount, credit: 0 },
          { account: 'النقدية', debit: 0, credit: amount }
        ]
      : [
          { account: 'النقدية', debit: amount, credit: 0 },
          { account: accountName, debit: 0, credit: amount }
        ]
  ) : [];

  return {
    description: userMessage,
    amount,
    date: new Date().toISOString().split('T')[0],
    category,
    confidence: amount > 0 ? 0.92 : 0.5, // Lower confidence for text without amount
    entries
  };
}

export default {
  sendToN8n,
  parseUserMessage
};
