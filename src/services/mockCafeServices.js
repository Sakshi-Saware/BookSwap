// src/services/mockCafeServices.js

/* ---------------------------------------------------------
    LOCAL STORAGE KEYS
--------------------------------------------------------- */
const LS_KEYS = {
  CAFE_ACCOUNTS: "cafe_accounts_v1",
  CAFE_EVENTS: "cafe_events_v1",
  CAFE_MESSAGES: "cafe_messages_v1",
};

/* ---------------------------------------------------------
    GENERIC LOCAL STORAGE HELPERS
--------------------------------------------------------- */
const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
};

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/* ---------------------------------------------------------
    CAFE AUTH (SIGNUP + LOGIN)
--------------------------------------------------------- */

export const mockCafeAuth = {
  // REGISTER NEW CAFE ACCOUNT
  register: async (data) => {
    const cafes = load(LS_KEYS.CAFE_ACCOUNTS);

    if (cafes.some((c) => c.email === data.email)) {
      return { success: false, message: "Email already registered as café" };
    }

    const newCafe = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      logo: "/default-cafe.png",
    };

    cafes.push(newCafe);
    save(LS_KEYS.CAFE_ACCOUNTS, cafes);

    return { success: true, cafe: newCafe };
  },

  // LOGIN EXISTING CAFE
  login: async (email, password) => {
    const cafes = load(LS_KEYS.CAFE_ACCOUNTS);

    const found = cafes.find(
      (c) => c.email === email && c.password === password
    );

    if (!found)
      return { success: false, message: "Invalid café email or password" };

    return { success: true, cafe: found };
  },
};

/* ---------------------------------------------------------
    SEED SAMPLE EVENTS (ON FIRST RUN)
--------------------------------------------------------- */

function seedEvents() {
  const existing = load(LS_KEYS.CAFE_EVENTS);
  if (existing.length > 0) return;

  const sampleEvents = [
    {
      id: "1",
      title: "Book Reading Evening",
      date: "2025-02-20",
      time: "06:00 PM",
      banner:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
      description: "A cozy reading session with poetry & coffee.",
      maxAttendees: 20,
      attendees: [
        {
          id: "u1",
          name: "John Doe",
          email: "john@example.com",
          status: "approved",
        },
        {
          id: "u2",
          name: "Sara Lee",
          email: "sara@example.com",
          status: "pending",
        },
      ],
    },
    {
      id: "2",
      title: "Fiction Lovers Meetup",
      date: "2025-03-05",
      time: "04:00 PM",
      banner:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800",
      description: "Discuss and exchange your favorite fiction books!",
      maxAttendees: 30,
      attendees: [],
    },
  ];

  save(LS_KEYS.CAFE_EVENTS, sampleEvents);
}

function seedMessages() {
  const existing = load(LS_KEYS.CAFE_MESSAGES);
  if (existing.length > 0) return;

  const sampleMessages = [
    {
      conversationId: "conv1",
      userName: "John Doe",
      lastMessage: "Looking forward to the event!",
      unread: 1,
      messages: [
        { from: "user", text: "Hi! Is this event still open?", time: "10:20 AM" },
        { from: "cafe", text: "Yes! You can RSVP anytime.", time: "10:22 AM" },
      ],
    },
  ];

  save(LS_KEYS.CAFE_MESSAGES, sampleMessages);
}

seedEvents();
seedMessages();

/* ---------------------------------------------------------
    EVENT CRUD API
--------------------------------------------------------- */

export const cafeEventsAPI = {
  getAllEvents() {
    return load(LS_KEYS.CAFE_EVENTS);
  },

  getEvent(id) {
    return load(LS_KEYS.CAFE_EVENTS).find((ev) => ev.id === id);
  },

  createEvent(eventData) {
    const events = load(LS_KEYS.CAFE_EVENTS);

    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      attendees: [],
    };

    events.push(newEvent);
    save(LS_KEYS.CAFE_EVENTS, events);

    return newEvent;
  },

  updateEvent(id, updatedData) {
    let events = load(LS_KEYS.CAFE_EVENTS);
    events = events.map((ev) =>
      ev.id === id ? { ...ev, ...updatedData } : ev
    );
    save(LS_KEYS.CAFE_EVENTS, events);
  },

  deleteEvent(id) {
    let events = load(LS_KEYS.CAFE_EVENTS);
    events = events.filter((ev) => ev.id !== id);
    save(LS_KEYS.CAFE_EVENTS, events);
  },

  addAttendee(eventId, user) {
    const events = load(LS_KEYS.CAFE_EVENTS);
    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    event.attendees.push({
      id: Date.now().toString(),
      ...user,
      status: "pending",
    });

    save(LS_KEYS.CAFE_EVENTS, events);
  },

  updateAttendeeStatus(eventId, attendeeId, status) {
    const events = load(LS_KEYS.CAFE_EVENTS);
    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    event.attendees = event.attendees.map((a) =>
      a.id === attendeeId ? { ...a, status } : a
    );

    save(LS_KEYS.CAFE_EVENTS, events);
  },
};

/* ---------------------------------------------------------
    MESSAGES API
--------------------------------------------------------- */

export const cafeMessagesAPI = {
  getConversations() {
    return load(LS_KEYS.CAFE_MESSAGES);
  },

  getMessages(conversationId) {
    return load(LS_KEYS.CAFE_MESSAGES).find(
      (c) => c.conversationId === conversationId
    );
  },

  sendMessage(conversationId, text) {
    const conversations = load(LS_KEYS.CAFE_MESSAGES);
    const convo = conversations.find((c) => c.conversationId === conversationId);
    if (!convo) return;

    convo.messages.push({
      from: "cafe",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    convo.lastMessage = text;
    convo.unread = 0;

    save(LS_KEYS.CAFE_MESSAGES, conversations);
  },
};
