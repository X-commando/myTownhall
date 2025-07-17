import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, municipalityName } = await request.json();

    // For now, we'll use a mock response since we don't have API keys set up
    // In production, you would call OpenAI or DeepSeek API here
    
    const mockResponse = generateMockResponse(messages[messages.length - 1].content, municipalityName);
    
    return NextResponse.json({
      content: mockResponse,
      usage: {
        prompt_tokens: 100,
        completion_tokens:50,
        total_tokens: 150
      }
    });

  } catch (error) {
    console.error('ChatAPI error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status:500}
    );
  }
}

function generateMockResponse(userMessage: string, municipalityName: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('budget') || message.includes('spending')) {
    return `Based on the budget information for ${municipalityName}, I can see the current budget breakdown. The total budget is $15.2 million for the current fiscal year. The largest spending categories are Public Safety (32%), Education (28%), and Infrastructure (18%). This represents about $4,850 per resident. Would you like me to break down any specific category in more detail?`;
  }
  
  if (message.includes('meeting') || message.includes('council')) {
    return `I can help you find information about upcoming and past meetings in ${municipalityName}. There are typically 2-3 council meetings per month, usually on the first and third Tuesday evenings. The next scheduled meeting is on March 19th at 7:00 PM, which will cover the quarterly budget review and infrastructure projects. Would you like me to provide more details about specific meetings or agenda items?`;
  }
  
  if (message.includes('community') || message.includes('discussion') || message.includes('forum')) {
    return `The community forum in ${municipalityName} is quite active! Recent discussions include concerns about road maintenance, proposals for a new community center, and updates on the local school district. The most popular thread has 45 upvotes and discusses traffic safety near the elementary school. Citizens are encouraged to participate in these discussions to help shape local policy decisions.`;
  }
  
  if (message.includes('population') || message.includes('demographics')) {
    return `${municipalityName} has a population of approximately 12,450 residents. The community has been growing steadily over the past decade, with a mix of families, young professionals, and retirees. The median age is 38, and about 65% of residents own their homes. The town has a strong sense of community with active participation in local events and government.`;
  }
  
  if (message.includes('public safety') || message.includes('police') || message.includes('fire')) {
    return `Public safety is a top priority in ${municipalityName}, with about 32% of the budget allocated to this area. This includes police services, fire protection, and emergency response. The town has its own police department with 18 officers and contracts with the county for fire services. Response times average 4-6 minutes for emergency calls. There's also an active neighborhood watch program that residents can join.`;
  }
  
  return `I'm here to help you learn more about ${municipalityName}! I can provide information about budgets, meetings, community discussions, and general town information. What specific aspect would you like to know more about? You can ask about spending priorities, upcoming events, or how to get involved in local government.`;
} 