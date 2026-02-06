// OpenAI API Integration for AI Personal Accountant

import type { ExtractedTransactionData } from '@/types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
}

// System prompt for the AI accountant
const SYSTEM_PROMPT = `أنت محاسب ذكي متخصص في تحويل المعاملات المالية إلى قيود محاسبية باللغة العربية.

مهمتك:
1. تحليل نص المعاملة المالية المدخلة
2. استخراج المعلومات المهمة (المبلغ، التاريخ، الوصف، التصنيف)
3. إنشاء قيد محاسبي مزدوج (مدين/دائن) صحيح

قواعد المحاسبة:
- المصروفات: مدين / النقدية: دائن
- الإيرادات: النقدية: مدين / الإيرادات: دائن
- الأصول: مدين عند الزيادة
- الالتزامات: دائن عند الزيادة

التصنيفات الشائعة:
- مصروفات الكهرباء، الماء، الإنترنت
- مصروفات الاتصالات
- مصروفات المواصلات والبنزين
- مصروفات المطاعم والضيافة
- مصروفات التسوق والمستلزمات
- إيرادات المبيعات
- إيرادات الخدمات

يجب أن ترد بصيغة JSON فقط:
{
  "description": "وصف المعاملة",
  "amount": 250,
  "date": "2025-02-04",
  "category": "تصنيف المعاملة",
  "type": "expense|income",
  "entries": [
    { "account": "اسم الحساب", "debit": 250, "credit": 0 },
    { "account": "اسم الحساب", "debit": 0, "credit": 250 }
  ],
  "confidence": 0.95
}`;

// Check if OpenAI API key is configured
export function isOpenAIConfigured(): boolean {
  return OPENAI_API_KEY.length > 0;
}

// Send message to OpenAI
export async function sendToOpenAI(
  userMessage: string
): Promise<{ success: boolean; data?: ExtractedTransactionData; error?: string }> {
  if (!isOpenAIConfigured()) {
    // Fallback to mock AI if no API key
    return mockAIResponse(userMessage);
  }

  try {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return { success: false, error: 'فشل الاتصال بـ AI' };
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: 'لم يتم استلام رد من AI' };
    }

    // Parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: {
            description: parsedData.description,
            amount: parsedData.amount,
            date: parsedData.date || new Date().toISOString().split('T')[0],
            category: parsedData.category,
            confidence: parsedData.confidence || 0.9,
            entries: parsedData.entries
          }
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    return { success: false, error: 'فشل تحليل رد AI' };
  } catch (error) {
    console.error('OpenAI request error:', error);
    return { success: false, error: 'حدث خطأ أثناء الاتصال' };
  }
}

// Mock AI response for testing without API key
function mockAIResponse(userMessage: string): { success: boolean; data?: ExtractedTransactionData; error?: string } {
  // Simulate processing delay
  const amountMatch = userMessage.match(/(\d+(?:\.\d+)?)\s*(ريال|ر.س|SAR)?/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  // Detect transaction type
  const hasExpenseKeywords = /(دفعت|اشتريت|فاتورة|مصروف|شراء|سداد)/i.test(userMessage);
  const hasIncomeKeywords = /(استلمت|تحصيل|إيراد|مبيعات|قبض)/i.test(userMessage);
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

  const entries = isExpense
    ? [
        { account: accountName, debit: amount, credit: 0 },
        { account: 'النقدية', debit: 0, credit: amount }
      ]
    : [
        { account: 'النقدية', debit: amount, credit: 0 },
        { account: accountName, debit: 0, credit: amount }
      ];

  return {
    success: true,
    data: {
      description: userMessage,
      amount,
      date: new Date().toISOString().split('T')[0],
      category,
      confidence: 0.92,
      entries
    }
  };
}

// Process image with OCR (mock implementation)
export async function processImageWithOCR(
  imageFile: File
): Promise<{ success: boolean; data?: ExtractedTransactionData; error?: string }> {
  // In a real implementation, you would:
  // 1. Upload the image to a server
  // 2. Use OCR service (Tesseract, Google Vision, etc.)
  // 3. Extract text and parse it
  // 4. Send to OpenAI for processing

  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          description: `فاتورة ${imageFile.name.split('.')[0]}`,
          amount: Math.floor(Math.random() * 900) + 100,
          date: new Date().toISOString().split('T')[0],
          vendor: 'شركة تجريبية',
          category: 'خدمات',
          confidence: 0.88,
          entries: [
            { account: 'مصروفات الخدمات', debit: 300, credit: 0 },
            { account: 'النقدية', debit: 0, credit: 300 }
          ]
        }
      });
    }, 2000);
  });
}

// Generate financial insights
export async function generateInsights(
  transactions: { amount: number; type: string; category: string; date: string }[]
): Promise<string> {
  if (!isOpenAIConfigured()) {
    return generateMockInsights(transactions);
  }

  const prompt = `حلل هذه المعاملات المالية وقدم رؤى ونصائح مفيدة باللغة العربية:
${JSON.stringify(transactions, null, 2)}

قدم:
1. ملخصاً موجزاً للوضع المالي
2. نصائح لتوفير المصاريف
3. ملاحظات على أنماط الإنفاق`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'أنت محلل مالي خبير. قدم رؤى قصيرة ومفيدة.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      return generateMockInsights(transactions);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || generateMockInsights(transactions);
  } catch (error) {
    return generateMockInsights(transactions);
  }
}

function generateMockInsights(
  transactions: { amount: number; type: string; category: string }[]
): string {
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  if (savingsRate > 20) {
    return 'أداء ممتاز! أنت توفر أكثر من 20% من دخلك. استمر في هذا الأداء الرائع.';
  } else if (savingsRate > 0) {
    return 'جيد! أنت توفر جزءاً من دخلك. حاول زيادة معدل الادخار إلى 20% لتحقيق أهدافك المالية.';
  } else {
    return 'تنبيه: مصروفاتك تتجاوز إيراداتك. ننصح بمراجعة نفقاتك والبحث عن طرق لتقليل المصروفات غير الضرورية.';
  }
}

export default {
  isOpenAIConfigured,
  sendToOpenAI,
  processImageWithOCR,
  generateInsights
};
