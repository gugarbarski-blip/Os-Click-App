import { GoogleGenAI } from "@google/genai";
import { ServiceOrder, OrderStatus, DeliveryMethod } from "../types";

export const analyzeOrders = async (orders: ServiceOrder[]): Promise<string> => {
  try {
    // If no API key is present, return a mock response or handle gracefully in UI
    if (!process.env.API_KEY) {
      return "API Key não configurada. Configure a variável de ambiente para usar a IA.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Filter only pending orders for analysis to save tokens and focus context
    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);

    if (pendingOrders.length === 0) {
      return "Não há pedidos pendentes para análise.";
    }

    // Prepare a simplified JSON for the model
    const ordersData = pendingOrders.map(o => ({
      os: o.osNumber,
      loja: o.storeName,
      prazo: o.deadline,
      tipo: o.deliveryMethod,
      vendedor: o.salesperson,
      obs: o.notes // Includes notes for AI context
    }));

    const prompt = `
      Aja como um gerente de logística experiente. Analise a seguinte lista de ordens de serviço (OS) pendentes.
      
      Dados: ${JSON.stringify(ordersData)}
      
      Por favor, forneça um relatório curto e direto (formato markdown) com:
      1. Resumo da Carga de Trabalho (quantos pedidos, urgência).
      2. Sugestão de Priorização (quais 3 OS devem ser feitas agora baseado no prazo).
      3. Logística (sugira agrupamento de entregas se houver várias OS de entrega, considere as observações).
      4. Um tom motivacional curto no final para a equipe.
      
      Mantenha a resposta concisa.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Erro na análise IA:", error);
    return "Erro ao conectar com o serviço de IA. Verifique sua conexão ou chave de API.";
  }
};