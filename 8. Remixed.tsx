import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Book, Code, Lightbulb, ArrowRight } from 'lucide-react';

const DataStructuresGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);

  const levels = [
    {
      id: 0,
      title: "Day 1: The Slow Log Parser",
      story: `It's your first day as a junior engineer at TechFlow Inc. Your manager Sarah rushes over: "We have a problem! Our log analysis system is crawling. It processes millions of log entries, and we're using an ArrayList that keeps inserting entries at the beginning. Every insert is taking forever!"

She shows you the current code that's causing bottlenecks. Your task is to understand why ArrayList performs poorly for frequent insertions at the head, and suggest a better approach.`,
      
      concept: "Array-backed vs Linked Lists",
      
      explanation: `When you insert at the beginning of an ArrayList (array-backed structure), every existing element must shift one position to the right. If you have n elements, that's n operations per insertion. With millions of log entries, this becomes extremely slow - O(n) per insertion!

A LinkedList, on the other hand, only needs to adjust a few pointers to insert at the head. It's O(1) - constant time, no matter how many elements exist.

Think of it like this: An ArrayList is like a row of parked cars. To add a car at the front, every car must back up one spot. A LinkedList is like a chain - you just disconnect one link and insert a new one.`,
      
      challenge: `// Fix this slow code by choosing the right data structure
// The system needs to add new logs at the FRONT constantly

class LogSystem {
  private List<String> logs;
  
  public LogSystem() {
    // TODO: Choose ArrayList or LinkedList here
    logs = new ????List<>();
  }
  
  public void addLog(String log) {
    logs.add(0, log); // Adding at index 0 (front)
  }
  
  public void printRecent(int n) {
    for (int i = 0; i < n && i < logs.size(); i++) {
      System.out.println(logs.get(i));
    }
  }
}`,
      
      solution: "LinkedList",
      hint: "Think about what happens when you insert at position 0. Which structure doesn't need to move existing elements?",
      
      visual: `ArrayList Insert at Front:
[A][B][C][D][E]  →  Insert X at front
     ↓ Shift all right!
[X][A][B][C][D][E]  (5 elements moved)

LinkedList Insert at Front:
A→B→C→D→E
     ↓ Just adjust pointers
X→A→B→C→D→E  (Only 2 pointer operations)`
    },

    {
      id: 1,
      title: "Day 2: The Broken Undo System",
      story: `The text editor team is panicking. Their undo feature is buggy and users are losing work! The lead engineer explains: "We built an undo system, but we need to track the user's position in the document AND efficiently insert/remove text at that position. Right now, we're recalculating positions every time, and it's a mess."

You realize this is a perfect use case for a positional list - a data structure that maintains stable position references even as the list changes.`,
      
      concept: "Positional Lists & Iteration Pattern",
      
      explanation: `A regular list uses indices (0, 1, 2...), but those indices change when you insert or remove elements. If you're at index 5 and delete index 2, suddenly you're at index 4 - your position shifted!

A Positional List uses Position objects - stable references that don't change when the list is modified. Think of it like bookmarks in a real book. Even if you add or remove pages, your bookmark stays in the same spot.

The Iterator pattern lets you traverse this structure safely. You can move forward/backward through positions without worrying about what index you're at.`,
      
      challenge: `// Implement a simple text editor operation using positional list concepts
// You need to insert text at a specific position and maintain cursor location

interface Position<E> {
  E getElement();
}

class TextEditor {
  PositionalList<Character> text;
  Position<Character> cursor;
  
  // TODO: Implement insert at cursor
  public void insertAtCursor(char c) {
    // Insert character BEFORE cursor position
    // Hint: Use addBefore() which returns new Position
    
  }
  
  // TODO: Implement delete at cursor
  public void deleteAtCursor() {
    // Remove character at cursor and move cursor forward
    // Hint: Store next position before removing
    
  }
}`,
      
      solution: `public void insertAtCursor(char c) {
  cursor = text.addBefore(cursor, c);
}

public void deleteAtCursor() {
  Position<Character> next = text.after(cursor);
  text.remove(cursor);
  cursor = next;
}`,
      
      hint: "Positions remain stable even after insertions/deletions. Store references before modifying!",
      
      visual: `Positional List vs Array:

Array: [H][E][L][L][O]
Index:  0  1  2  3  4
Delete index 1 → [H][L][L][O]
Index:  0  1  2  3  (Everything shifted!)

Positional List:
P1→'H' P2→'E' P3→'L' P4→'L' P5→'O'
Delete P2 → P1→'H' P3→'L' P4→'L' P5→'O'
(Positions P1,P3,P4,P5 stay the same!)`
    },

    {
      id: 2,
      title: "Day 3: The Customer Support Crisis",
      story: `"Emergency!" shouts the VP of Customer Success. "Our support ticket system is broken! High-priority VIP customers are waiting hours while low-priority tickets get answered first. We need tickets processed by priority, but we have thousands coming in every minute!"

You need a data structure that can efficiently find and remove the highest-priority item, even when new high-priority tickets arrive constantly. This is a classic Priority Queue problem.`,
      
      concept: "Priority Queues & Heap Operations",
      
      explanation: `A Priority Queue isn't first-in-first-out like a regular queue. It always gives you the highest (or lowest) priority item, regardless of when it arrived. 

The most efficient implementation uses a heap - a special binary tree structure. A min-heap ensures that the parent is always smaller than its children. This means the root is always the minimum, and we can extract it in O(log n) time.

The heap invariant is crucial: "Every parent must be ≤ its children (min-heap) or ≥ its children (max-heap)." When you insert or remove items, you must restore this invariant through "bubbling up" or "bubbling down" operations.`,
      
      challenge: `// Implement priority queue operations for the ticket system
// Tickets have priority (1=highest, 10=lowest) and description

class SupportTicket {
  int priority;
  String description;
  
  public SupportTicket(int p, String d) {
    this.priority = p;
    this.description = d;
  }
}

class TicketSystem {
  // Min-heap: smallest priority = most urgent
  PriorityQueue<SupportTicket> tickets;
  
  public TicketSystem() {
    // TODO: Create PQ with custom comparator
    // Compare by priority (lower number = higher priority)
    tickets = new PriorityQueue<>(???);
  }
  
  public void submitTicket(int priority, String desc) {
    // TODO: Add ticket - heap will maintain order
    
  }
  
  public SupportTicket getNextTicket() {
    // TODO: Remove and return highest priority ticket
    
  }
}`,
      
      solution: `public TicketSystem() {
  tickets = new PriorityQueue<>((a, b) -> 
    Integer.compare(a.priority, b.priority)
  );
}

public void submitTicket(int priority, String desc) {
  tickets.add(new SupportTicket(priority, desc));
}

public SupportTicket getNextTicket() {
  return tickets.poll();
}`,
      
      hint: "PriorityQueue needs a way to compare tickets. Use a Comparator to define what 'highest priority' means!",
      
      visual: `Min-Heap Structure (parent ≤ children):

         1
       /   \\
      3     2
     / \\   /
    7   5 4

After removing 1 (root):
1. Move last element (4) to root
2. Bubble down to restore heap invariant

         4
       /   \\
      3     2    → Swap 4 with 2
     / \\  
    7   5 

         2
       /   \\
      3     4    ✓ Heap invariant restored!
     / \\  
    7   5`
    },

    {
      id: 3,
      title: "Day 4: The Event Simulator",
      story: `The DevOps team needs your help! They're building a system simulator to test how their servers handle events (user requests, database queries, cache misses). Events arrive with timestamps, and they must be processed in chronological order.

"We tried a simple list, but with hundreds of thousands of events, finding the next event to process takes forever!" explains the team lead. You realize this is another perfect Priority Queue application - a discrete event simulation.`,
      
      concept: "PQ Applications: Discrete Event Simulation",
      
      explanation: `In discrete event simulation, events happen at specific times. You need to always process the next chronological event, even as new events are scheduled in the future.

A Priority Queue (min-heap on timestamp) is perfect here. You can insert new events in O(log n) time and always extract the earliest event in O(log n) time. With a simple sorted list, insertion would take O(n) - way too slow for real-time simulation!

This pattern appears everywhere: operating system schedulers, network packet routing, game engines, and financial trading systems all use PQs to manage time-ordered events efficiently.`,
      
      challenge: `// Implement a discrete event simulator using Priority Queue

class Event {
  double timestamp;  // When event occurs
  String type;       // "REQUEST", "QUERY", "CACHE_MISS"
  
  public Event(double t, String type) {
    this.timestamp = t;
    this.type = type;
  }
}

class EventSimulator {
  PriorityQueue<Event> eventQueue;
  double currentTime = 0.0;
  
  public EventSimulator() {
    // TODO: Create PQ ordered by timestamp
    
  }
  
  public void scheduleEvent(double time, String type) {
    // TODO: Add event to queue
    
  }
  
  public void runSimulation(double endTime) {
    while (!eventQueue.isEmpty() && 
           currentTime <= endTime) {
      // TODO: Get next event (earliest timestamp)
      Event next = ???;
      currentTime = next.timestamp;
      processEvent(next);
    }
  }
  
  private void processEvent(Event e) {
    System.out.println("Time " + e.timestamp + 
                       ": " + e.type);
  }
}`,
      
      solution: `public EventSimulator() {
  eventQueue = new PriorityQueue<>((a, b) -> 
    Double.compare(a.timestamp, b.timestamp)
  );
}

public void scheduleEvent(double time, String type) {
  eventQueue.add(new Event(time, type));
}

public void runSimulation(double endTime) {
  while (!eventQueue.isEmpty() && 
         currentTime <= endTime) {
    Event next = eventQueue.poll();
    currentTime = next.timestamp;
    processEvent(next);
  }
}`,
      
      hint: "Events should be processed in time order. What should the PQ compare to determine 'highest priority'?",
      
      visual: `Event Queue (min-heap on time):

Time 1.5: REQUEST
Time 0.3: QUERY      →  Always extract
Time 2.1: CACHE_MISS     earliest timestamp
Time 0.8: REQUEST

Processed order:
0.3: QUERY
0.8: REQUEST
1.5: REQUEST
2.1: CACHE_MISS

This is O(log n) per event vs O(n) with sorted list!`
    },

    {
      id: 4,
      title: "Final Challenge: The Dynamic Feed",
      story: `Congratulations on making it this far! The CEO has a special project: building a social media feed that combines efficiency of all the structures you've learned.

"We need a feed that: (1) Loads new posts at the top efficiently, (2) Lets users bookmark specific posts and navigate to them quickly, (3) Ranks posts by engagement score, and (4) Processes trending events as they happen."

This is your chance to combine everything: dynamic arrays, linked lists, positional lists, and priority queues into one coherent system!`,
      
      concept: "Putting It All Together",
      
      explanation: `Real systems rarely use just one data structure. The art of software engineering is choosing the right structure for each component:

• Use LinkedList for the main feed (constant-time insertion at head)
• Use PositionalList for bookmark navigation (stable position references)  
• Use PriorityQueue for trending posts (ordered by engagement)
• Use dynamic ArrayList for caching recent views (fast random access)

Each structure excels at its specific role. The key is understanding the operations you need to support and matching them to data structure strengths. Insert at head? Linked. Random access? Array. Always extract max? Heap.`,
      
      challenge: `// Design the social media feed system

class Post {
  String content;
  int engagementScore;
  long timestamp;
}

class SocialFeed {
  // TODO: Choose right structure for main feed
  // Requirement: Constant-time insertion at top
  ???<Post> mainFeed;
  
  // TODO: Choose right structure for bookmarks
  // Requirement: Stable references to posts
  ???<Post> bookmarks;
  
  // TODO: Choose right structure for trending
  // Requirement: Always show highest engagement first
  ???<Post> trendingQueue;
  
  // TODO: Choose right structure for recent cache
  // Requirement: Fast access to last N viewed posts by index
  ???<Post> recentCache;
  
  public void addNewPost(Post p) {
    // Add to top of main feed
  }
  
  public void markAsTrending(Post p) {
    // Add to trending queue
  }
  
  public Post getMostEngagingTrending() {
    // Get post with highest engagement
  }
}`,
      
      solution: `class SocialFeed {
  LinkedList<Post> mainFeed;           // O(1) insert at head
  PositionalList<Post> bookmarks;      // Stable position references
  PriorityQueue<Post> trendingQueue;   // Max-heap by engagement
  ArrayList<Post> recentCache;         // Fast index access
  
  public SocialFeed() {
    mainFeed = new LinkedList<>();
    bookmarks = new LinkedPositionalList<>();
    trendingQueue = new PriorityQueue<>((a, b) -> 
      Integer.compare(b.engagementScore, a.engagementScore)
    );
    recentCache = new ArrayList<>();
  }
}`,
      
      hint: "Each component has different needs. Match the operation (insert at head, maintain order, random access) to the right structure!",
      
      visual: `System Architecture:

MainFeed (LinkedList):
NewPost → Post1 → Post2 → Post3
  ↓ O(1) insert at head

Bookmarks (PositionalList):
P1→Post5  P2→Post12  P3→Post8
  ↓ Stable references

Trending (PriorityQueue):
      Post7(1000 engagement)
     /                    \\
Post3(800)            Post9(900)
  ↓ Always extract max

RecentCache (ArrayList):
[Post1][Post4][Post2][Post8][Post3]
  ↓ O(1) access by index`
    }
  ];

  const checkSolution = () => {
    const level = levels[currentLevel];
    const normalized = userCode.trim().toLowerCase().replace(/\s+/g, '');
    const expectedSolution = level.solution.toLowerCase().replace(/\s+/g, '');
    
    if (normalized.includes(expectedSolution)) {
      setFeedback({ success: true, message: "Excellent work! You've mastered this concept. The system is running smoothly now!" });
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels([...completedLevels, currentLevel]);
      }
    } else {
      setFeedback({ success: false, message: "Not quite right. Think about the concept explanation and try again. Use the hint if you're stuck!" });
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserCode('');
      setFeedback(null);
      setShowHint(false);
    }
  };

  const level = levels[currentLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-width-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-indigo-900">
              Data Structures: The TechFlow Chronicles
            </h1>
            <div className="text-sm text-gray-600">
              Progress: {completedLevels.length} / {levels.length} levels completed
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {levels.map((l, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded ${
                  completedLevels.includes(idx) ? 'bg-green-500' :
                  idx === currentLevel ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 mb-6 rounded">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">
              {level.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{level.story}</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Book className="text-blue-600" size={20} />
              <h3 className="text-xl font-semibold text-blue-900">
                Concept: {level.concept}
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {level.explanation}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 mb-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-purple-600" size={20} />
              <h3 className="text-xl font-semibold text-purple-900">
                Visual Representation
              </h3>
            </div>
            <pre className="text-sm text-gray-800 font-mono whitespace-pre overflow-x-auto">
              {level.visual}
            </pre>
          </div>

          <div className="bg-gray-50 border border-gray-300 p-6 mb-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Code className="text-gray-700" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">
                Your Challenge
              </h3>
            </div>
            <pre className="text-sm text-gray-800 font-mono mb-4 overflow-x-auto bg-white p-4 rounded border">
              {level.challenge}
            </pre>
            
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Type your solution here..."
              className="w-full h-40 p-4 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={checkSolution}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <Play size={20} />
                Test Solution
              </button>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
              >
                <Lightbulb size={20} />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            {showHint && (
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-amber-900 font-medium">💡 Hint: {level.hint}</p>
              </div>
            )}
          </div>

          {feedback && (
            <div className={`border-l-4 p-6 rounded mb-6 ${
              feedback.success 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center gap-3">
                {feedback.success ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-red-600" size={24} />
                )}
                <p className={`font-semibold ${
                  feedback.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {feedback.message}
                </p>
              </div>
            </div>
          )}

          {feedback?.success && currentLevel < levels.length - 1 && (
            <button
              onClick={nextLevel}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              Continue to Next Day
              <ArrowRight size={24} />
            </button>
          )}

          {feedback?.success && currentLevel === levels.length - 1 && (
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
              <p className="text-lg leading-relaxed">
                You've completed all the challenges and mastered fundamental data structures! You now understand when to use arrays vs linked lists, how positional lists maintain stable references, and how priority queues efficiently manage ordered data. These concepts will serve you throughout your computer science journey. Welcome to the team at TechFlow!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataStructuresGame;