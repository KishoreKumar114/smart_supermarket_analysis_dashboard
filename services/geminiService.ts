import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    customerSegmentation: {
      type: Type.OBJECT,
      description: "Counts of customers in each segment.",
      properties: {
        premium: { type: Type.INTEGER, description: "Count of premium customers." },
        regular: { type: Type.INTEGER, description: "Count of regular customers." },
        normal: { type: Type.INTEGER, description: "Count of normal customers." },
      },
    },
    dailySales: {
      type: Type.ARRAY,
      description: "Daily sales and purchase trends for the last 7 days.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (e.g., 'Mon')." },
          sales: { type: Type.NUMBER, description: "Total sales amount for the day." },
          purchases: { type: Type.NUMBER, description: "Total purchase amount for the day." },
        },
      },
    },
    topCategories: {
      type: Type.ARRAY,
      description: "Top 5 best-selling product categories.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Category name." },
          value: { type: Type.NUMBER, description: "Total sales value for the category." },
        },
      },
    },
    topCustomers: {
      type: Type.ARRAY,
      description: "Top 5 customers by spending.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Customer ID." },
          name: { type: Type.STRING, description: "Customer name." },
          totalSpending: { type: Type.NUMBER, description: "Total amount spent by the customer." },
          frequency: { type: Type.INTEGER, description: "Number of visits or purchases." },
          segment: { type: Type.STRING, description: "Customer segment ('premium', 'regular', or 'normal')." },
        },
      },
    },
  },
};

export const analyzeSalesData = async (data: string): Promise<DashboardData> => {
  try {
    const prompt = `
      Analyze the provided supermarket sales data (e.g., CSV, JSON).
      Extract and calculate the following metrics:
      1.  **Customer Segmentation**: Count of 'premium' (top 10% spenders), 'regular' (next 40%), and 'normal' (bottom 50%) customers.
      2.  **Daily Sales**: Summarize sales and purchases for the last 7 distinct days found in the data.
      3.  **Top 5 Selling Categories**: By total sales value.
      4.  **Top 5 Customers**: List the top 5 customers by total spending, including their purchase frequency and their segment ('premium', 'regular', or 'normal').

      Data:
      ---
      ${data}
      ---
      
      Respond strictly in the provided JSON format. If the data is insufficient, return empty or zero values for the metrics.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest", // Using latest flash model for speed
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 0 }, // Speed up analysis
      },
    });
    
    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    // Basic validation to ensure the structure matches DashboardData
    if (
      !parsedData.customerSegmentation ||
      !parsedData.dailySales ||
      !parsedData.topCategories ||
      !parsedData.topCustomers
    ) {
      throw new Error("AI response is missing required data fields.");
    }
    
    return parsedData as DashboardData;

  } catch (error) {
    console.error("Error analyzing sales data with Gemini:", error);
    throw new Error("Failed to analyze data. The AI model could not process the request.");
  }
};