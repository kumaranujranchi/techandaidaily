import { Article, Author } from './types';

export const AUTHORS: Record<string, Author> = {
  'sarah': {
    id: '1',
    name: 'Sarah Chen',
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
    role: 'Senior AI Researcher'
  },
  'david': {
    id: '2',
    name: 'David Miller',
    avatarUrl: 'https://picsum.photos/seed/david/100/100',
    role: 'Tech Editor'
  },
  'elena': {
    id: '3',
    name: 'Elena Ross',
    avatarUrl: 'https://picsum.photos/seed/elena/100/100',
    role: 'Product Lead'
  }
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Architecture of Reasoning: Inside the New Wave of Chain-of-Thought Models',
    summary: 'How structured "thinking" tokens are reducing hallucination rates in large language models by over 40% in complex reasoning tasks.',
    content: `
      <p>In the race to achieve Artificial General Intelligence (AGI), the sheer size of models has often been the primary metric of progress. However, a paradigm shift is occurring. The latest generation of models, including the recently announced Gemini 2.5 series, is prioritizing <strong>cognitive architecture</strong> over parameter count.</p>
      
      <h3>The Problem with "Fast" Thinking</h3>
      <p>Traditional LLMs operate like an improv actor: they generate the next most likely token immediately. This "System 1" thinking (to borrow from Daniel Kahneman) is excellent for creative writing but prone to errors in logic, math, and coding.</p>
      
      <h3>Enter Chain-of-Thought (CoT)</h3>
      <p>The new wave of "reasoning" models introduces a hidden layer of processing—a "thinking budget." Before outputting a single character of the final response, the model engages in an internal monologue, testing hypotheses and error-checking its own logic.</p>
      
      <blockquote>
        "We are seeing error rates in complex mathematical benchmarks drop by nearly 40% simply by allowing the model to 'pause' and compute its reasoning path." — Dr. Emily Zhang, Lead Research Scientist.
      </blockquote>

      <h3>Implications for Developers</h3>
      <p>For engineers, this means a shift in prompt engineering. Instead of complex "few-shot" examples, we can now rely on simpler prompts that explicitly request a reasoning trace. However, this comes at the cost of latency.</p>
      
      <p>The trade-off between <em>inference cost</em> and <em>accuracy</em> is the new optimization frontier for AI product managers.</p>
    `,
    category: 'Deep Dive',
    author: AUTHORS['sarah'],
    publishedAt: '2023-10-24T08:00:00Z',
    imageUrl: 'https://picsum.photos/seed/tech1/1200/800',
    tags: ['LLM', 'Reasoning', 'Architecture', 'Gemini'],
    isTopStory: true,
    readTimeMinutes: 8,
    aiSummary: 'New "reasoning" models use internal Chain-of-Thought processes to reduce errors by 40%. This shifts the focus from model size to cognitive architecture, improving accuracy at the cost of higher latency.'
  },
  {
    id: '2',
    title: 'OpenAI vs Google: The Battle for Multimodal Dominance Heats Up',
    summary: 'A comparative analysis of the latest vision and audio capabilities released this week.',
    content: `
      <p>The multimodal AI landscape shifted tectonically this week. With Google's update to Gemini 1.5 Pro and OpenAI's latest vision patch, the gap between text-only and truly native multimodal models is vanishing.</p>
      <p>Our benchmarks show that for video analysis, context window size remains the killer feature. Being able to ingest a 2-hour movie and query specific frames is a capability that changes entire industries, from media editing to security surveillance.</p>
    `,
    category: 'News',
    author: AUTHORS['david'],
    publishedAt: '2023-10-23T14:30:00Z',
    imageUrl: 'https://picsum.photos/seed/tech2/800/600',
    tags: ['Multimodal', 'Industry', 'Benchmarks'],
    readTimeMinutes: 4,
  },
  {
    id: '3',
    title: 'Implementing RAG with Vector Databases: A Practical Guide',
    summary: 'Step-by-step tutorial on setting up a Retrieval-Augmented Generation pipeline using Pinecone and LangChain.',
    content: `
      <p>Retrieval-Augmented Generation (RAG) is the industry standard for grounding LLMs in private data. In this tutorial, we will build a simple document chat bot.</p>
      <h3>Step 1: Chunking your Data</h3>
      <p>The first step is often the most overlooked. Naive splitting by character count breaks semantic meaning. We recommend recursive character splitting...</p>
    `,
    category: 'Tutorial',
    author: AUTHORS['elena'],
    publishedAt: '2023-10-22T09:15:00Z',
    imageUrl: 'https://picsum.photos/seed/tech3/800/600',
    tags: ['RAG', 'Engineering', 'Code'],
    readTimeMinutes: 12,
  },
  {
    id: '4',
    title: 'The Ethics of Synthetic Data Training',
    summary: 'As human data runs dry, AI is eating itself. What are the consequences for model collapse and bias?',
    content: `
      <p>Researchers predict we will run out of high-quality public human text data by 2026. The solution proposed by major labs is synthetic data—training models on the output of other models.</p>
      <p>However, early studies on "Model Collapse" suggest this leads to a degradation of quality, similar to making a photocopy of a photocopy. The edges blur, the nuance is lost, and the output becomes a regression to the mean.</p>
    `,
    category: 'Research',
    author: AUTHORS['sarah'],
    publishedAt: '2023-10-21T11:00:00Z',
    imageUrl: 'https://picsum.photos/seed/tech4/800/600',
    tags: ['Ethics', 'Data', 'Research'],
    readTimeMinutes: 6,
  },
  {
    id: '5',
    title: 'Why Python remains the King of AI',
    summary: 'Despite the rise of Rust and Mojo, Python\'s ecosystem dominance is unshakeable for at least another decade.',
    content: `
      <p>Performance isn't everything. Developer velocity is. While Mojo promises C-level speed with Python syntax, the sheer inertia of the PyTorch and NumPy ecosystem creates a moat that is incredibly difficult to cross.</p>
    `,
    category: 'Opinion',
    author: AUTHORS['david'],
    publishedAt: '2023-10-20T16:45:00Z',
    imageUrl: 'https://picsum.photos/seed/tech5/800/600',
    tags: ['Python', 'Programming', 'Career'],
    readTimeMinutes: 5,
  }
];