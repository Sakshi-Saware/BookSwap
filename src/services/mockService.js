// src/services/mockService.js
import dayjs from "dayjs";

const LS = {
  BOOKS: "books_v1",
  USERS: "users_v1",
  REQUESTS: "requests_v1",
  ESCROW: "escrow_v1",
  CHATS: "chats_v1",
  WISHLISTS: "wishlists_v1",
  FRIENDS: "friends_v1",
  REVIEWS: "reviews_v1",
  LIKES: "likes_v1",
  NOTIFICATIONS: "notifications_v1",
  EVENTS: "events_v1",
  SEEDED_FLAG: "seeded_v1",
};

/* -------------------------
   LocalStorage utils
--------------------------*/
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (err) {
    // corrupted JSON
    console.error("LocalStorage read error for", key, err);
    return null;
  }
}

function safeWrite(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("LocalStorage write failed", key, err);
    if (err && err.name === "QuotaExceededError") {
      alert(
        "⚠️ LocalStorage quota exceeded. Large data (images/base64) cannot be saved. " +
          `Failed to write "${key}".`
      );
    }
    // swallow error to avoid app crash
  }
}

function write(key, val) {
  safeWrite(key, val);
}

function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

/* -------------------------
   UID Normalization
--------------------------*/
function normalizeUid(uid) {
  if (!uid || uid === "undefined") return "me_dummy";
  if (typeof uid === "string" && uid.startsWith("firebase:")) return "me_dummy";
  return uid;
}
function normalizeLocation(loc) {
  if (!loc) return "";
  return loc.trim();
}

/* -------------------------
   Genre Normalization
--------------------------*/
function normalizeGenre(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((g) => g.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((g) => g.trim()).filter(Boolean);
  }
  return [];
}

/* -------------------------
   Seed mock database (safe)
--------------------------*/
function seed() {
  // Prevent reseeding multiple times (hot reload / refresh)
  if (read(LS.SEEDED_FLAG)) return;
  safeWrite(LS.SEEDED_FLAG, true);

  // ---------------------------
  // Event sets (defined first)
  // ---------------------------
  const eventSet1 = [
    {
      id: "ev_meet_1",
      title: "Pune Book Lovers Meetup",
      category: "meetup",
      host: "City Library",
      hostId: "u_alex",
      banner: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      description: "Join fellow readers for discussions, book swaps, and chai!",
      location: "JM Road, Pune",
      date: "2025-01-22",
      time: "5:00 PM",
      mapsLink: "https://maps.google.com/?q=JM+Road+Pune",
      attendees: [],
      comments: [],
    },
    {
      id: "ev_exchange_1",
      title: "Book Exchange Carnival",
      category: "exchange",
      host: "BookSwap Cafe",
      hostId: "cafe_12345",
      banner: "https://images.unsplash.com/photo-1514894786520-e2a3b0c6cc6a",
      description: "Bring a book, take a book. Meet amazing people!",
      location: "Kothrud, Pune",
      date: "2025-01-28",
      time: "4:00 PM",
      mapsLink: "https://maps.google.com/?q=Kothrud+Pune",
      attendees: [],
      comments: [],
    },
    {
      id: "ev_fair_1",
      title: "Vintage Book Fair",
      category: "fair",
      host: "Readers Club India",
      hostId: "u_neha",
      banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
      description: "Explore rare books, collectibles, and author signings.",
      location: "Baner, Pune",
      date: "2025-02-05",
      time: "11:00 AM",
      mapsLink: "https://maps.google.com/?q=Baner+Pune",
      attendees: [],
      comments: [],
    },
  ];

  const eventSet2 = [
    {
      id: uid("event"),
      category: "meetup",
      title: "Readers Meetup – Koregaon Park",
      banner: "/images/events/meetup1.jpg",
      description:
        "Join your fellow book lovers for a cozy reading circle, book discussions, and exchange recommendations.",
      location: "Starbucks, Koregaon Park, Pune",
      mapsLink: "https://maps.google.com/?q=Koregaon+Park+Starbucks",
      date: "2025-11-28",
      time: "5:00 PM",
      hostId: "u_alex",
      attendees: [],
      comments: [],
    },
    {
      id: uid("event"),
      category: "exchange",
      title: "Book Exchange Carnival – Baner",
      banner: "/images/events/exchange.jpg",
      description:
        "Bring 1–5 books and exchange them with others! A fun, sustainable way to discover new reads.",
      location: "Baner High Street, Pune",
      mapsLink: "https://maps.google.com/?q=Baner+High+Street",
      date: "2025-12-02",
      time: "4:00 PM",
      hostId: "u_neha",
      attendees: [],
      comments: [],
    },
    {
      id: uid("event"),
      category: "fair",
      title: "Annual Pune Book Fair 2025",
      banner: "/images/events/fair1.jpg",
      description:
        "The largest book fair in Pune! 200+ stalls, author signings, workshops, and exclusive discounts.",
      location: "Pune Exhibition Center",
      mapsLink: "https://maps.google.com/?q=Pune+Exhibition+Center",
      date: "2025-12-18",
      time: "10:00 AM",
      hostId: "u_ron",
      attendees: [],
      comments: [],
    },
  ];

  // ---------------------------
  // Seed USERS (only if empty)
  // ---------------------------
  if (!read(LS.USERS)) {
    const users = [
      {
        uid: "u_alex",
        name: "Alex Patel",
        email: "alex@mail.com",
        password: "123456",
        rating: 4.8,
        location: "MG Road",
        role: "user",
      },
      {
        uid: "u_neha",
        name: "Neha Singh",
        email: "neha@mail.com",
        password: "123456",
        rating: 4.6,
        location: "Baner",
        role: "user",
      },
      {
        uid: "u_ron",
        name: "Ron Das",
        email: "ron@mail.com",
        password: "123456",
        rating: 4.2,
        location: "Khar",
        role: "user",
      },
    ];
    write(LS.USERS, users);
  }

  // ---------------------------
  // Seed BOOKS (only if empty)
  // ---------------------------
  if (!read(LS.BOOKS)) {
    const books = [
      {
        id: uid("book"),
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: ["Fiction", "Philosophy", "Adventure"],
        condition: "Good",
        ownerId: "u_alex",
        deposit: 100,
        location: "MG Road",
        available: true,
      },
      {
        id: uid("book"),
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: ["Programming"],
        condition: "Readable",
        ownerId: "u_neha",
        deposit: 250,
        location: "Baner",
        available: true,
      },
      {
        id: uid("book"),
        title: "Ponniyin Selvan",
        author: "Kalki",
        genre: ["Historical"],
        condition: "New",
        ownerId: "u_ron",
        deposit: 0,
        location: "Khar",
        available: true,
      },
    ];
    write(LS.BOOKS, books);
  }

  // ---------------------------
  // Seed CHATS (only if empty)
  // ---------------------------
  if (!read(LS.CHATS)) {
    write(LS.CHATS, [
      {
        chatId: "chat_alex",
        participants: ["u_alex", "me_dummy"],
        messages: [
          {
            id: uid("m"),
            sender: "u_alex",
            text: "Hey! Want to swap this weekend?",
            at: dayjs().subtract(1, "day").toISOString(),
          },
        ],
      },
    ]);
  }

  // ---------------------------
  // Seed OTHER small tables (only if empty)
  // ---------------------------
  if (!read(LS.REQUESTS)) write(LS.REQUESTS, []);
  if (!read(LS.ESCROW)) write(LS.ESCROW, []);
  if (!read(LS.WISHLISTS)) write(LS.WISHLISTS, {});
  if (!read(LS.REVIEWS)) write(LS.REVIEWS, []);
  if (!read(LS.LIKES)) write(LS.LIKES, {});
  if (!read(LS.NOTIFICATIONS)) write(LS.NOTIFICATIONS, []);

  if (!read(LS.FRIENDS)) {
    write(LS.FRIENDS, {
      me_dummy: ["u_alex", "u_neha", "u_ron"],
      u_alex: ["me_dummy"],
      u_neha: ["me_dummy"],
      u_ron: ["me_dummy"],
    });
  }

  // ---------------------------
  // Seed EVENTS (merged) - only if empty
  // ---------------------------
  if (!read(LS.EVENTS)) {
    write(LS.EVENTS, [...eventSet1, ...eventSet2]);
  }
}

seed();

/* -------------------------
   MOCK SERVICE API
--------------------------*/

export const mock = {
  /* ------------------------------
        USERS / CAFES
  ------------------------------*/
  addUser(user) {
    const users = read(LS.USERS) || [];
    if (users.some((u) => u.email === user.email))
      return Promise.reject("Email already registered");

    // avoid storing very large base64 images in user objects
    if (user.photo && typeof user.photo === "string" && user.photo.length > 300000) {
      alert("⚠️ Profile image too large. It will not be saved in local storage.");
      delete user.photo;
    }

    user.uid = user.uid || uid("u");
    user.role = user.role || "user";
    users.unshift(user);
    write(LS.USERS, users);

    const safe = { ...user };
    if (safe.password) delete safe.password;
    return Promise.resolve(safe);
  },

  addCafe(cafe) {
    const users = read(LS.USERS) || [];
    if (users.some((u) => u.email === cafe.email))
      return Promise.reject("Email already registered");

    // avoid large logos
    if (cafe.logo && typeof cafe.logo === "string" && cafe.logo.length > 300000) {
      alert("⚠️ Café logo too large. It will not be saved in local storage.");
      delete cafe.logo;
    }

    cafe.uid = cafe.uid || uid("cafe");
    cafe.role = "cafe";
    users.unshift(cafe);
    write(LS.USERS, users);

    const safe = { ...cafe };
    if (safe.password) delete safe.password;
    return Promise.resolve(safe);
  },

  authenticate(email, password, role) {
    const users = read(LS.USERS) || [];
    const found = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        (role === "both" || u.role === role)
    );

    if (!found) return Promise.reject("Invalid credentials");

    const safe = { ...found };
    delete safe.password;

    return Promise.resolve(safe);
  },

  listUsers() {
    return Promise.resolve(read(LS.USERS) || []);
  },

  getUser(uid) {
    return Promise.resolve((read(LS.USERS) || []).find((u) => u.uid === uid));
  },

  updateUser(uid, patch) {
    const users = read(LS.USERS) || [];
    const idx = users.findIndex((u) => u.uid === uid);

    if (idx === -1) return Promise.reject("User not found");

    // avoid saving large images accidentally
    if (patch.photo && typeof patch.photo === "string" && patch.photo.length > 300000) {
      alert("⚠️ Image too large. It will not be saved.");
      delete patch.photo;
    }

    users[idx] = { ...users[idx], ...patch };
    write(LS.USERS, users);

    const safe = { ...users[idx] };
    if (safe.password) delete safe.password;
    return Promise.resolve(safe);
  },

  /* ------------------------------
         BOOKS
  ------------------------------*/
  listBooks(filters = {}) {
    const all = read(LS.BOOKS) || [];
    let res = all;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      res = res.filter((b) =>
        (b.title + " " + b.author + " " + (b.genre || []).join(" ")).toLowerCase().includes(q)
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      res = res.filter((b) => b.location.toLowerCase().includes(loc));
    }

    return Promise.resolve(res);
  },

  getBook(id) {
    return Promise.resolve((read(LS.BOOKS) || []).find((b) => b.id === id));
  },

  addBook(book) {
    const books = read(LS.BOOKS) || [];
    book.id = uid("book");
    book.genre = normalizeGenre(book.genre);
    books.unshift(book);
    write(LS.BOOKS, books);

    return Promise.resolve(book);
  },

  updateBook(id, patch) {
    const books = read(LS.BOOKS) || [];
    const idx = books.findIndex((b) => b.id === id);

    if (idx === -1) return Promise.reject("Book not found");

    const updated = {
      ...books[idx],
      ...patch,
      genre: normalizeGenre(patch.genre || books[idx].genre),
    };

    books[idx] = updated;
    write(LS.BOOKS, books);

    return Promise.resolve(updated);
  },

  deleteBook(id) {
    const books = read(LS.BOOKS) || [];
    write(LS.BOOKS, books.filter((b) => b.id !== id));
    return Promise.resolve();
  },

  /* ------------------------------
        FRIENDS
  ------------------------------*/
  listFriends(uid) {
    const real = normalizeUid(uid);
    const friends = new Set(read(LS.FRIENDS)?.[real] || []);
    const reqs = read(LS.REQUESTS) || [];
    const chats = read(LS.CHATS) || [];

    reqs.forEach((r) => {
      if (r.fromUid === real) friends.add(r.toUid);
      if (r.toUid === real) friends.add(r.fromUid);
    });

    chats.forEach((c) => {
      if (c.participants.includes(real)) {
        c.participants.forEach((p) => p !== real && friends.add(p));
      }
    });

    return Promise.resolve([...friends]);
  },

  /* ------------------------------
         CHATS
  ------------------------------*/
  getChats() {
    return Promise.resolve(read(LS.CHATS) || []);
  },

  sendMessage(fromUid, toUid, text) {
    const chats = read(LS.CHATS) || [];
    const myUid = normalizeUid(fromUid);

    let chat = chats.find(
      (c) => c.participants.includes(myUid) && c.participants.includes(toUid)
    );

    if (!chat) {
      chat = {
        chatId: uid("chat"),
        participants: [myUid, toUid],
        messages: [],
      };
      chats.push(chat);
    }

    const msg = {
      id: uid("m"),
      sender: myUid,
      text,
      at: new Date().toISOString(),
    };

    chat.messages.push(msg);
    write(LS.CHATS, chats);

    return Promise.resolve(msg);
  },

  /* ------------------------------
        WISHLIST
  ------------------------------*/
  addToWishlist(uid, bookId) {
    const list = read(LS.WISHLISTS) || {};
    const real = normalizeUid(uid);

    list[real] = list[real] || [];
    if (!list[real].includes(bookId)) list[real].push(bookId);

    write(LS.WISHLISTS, list);
    return Promise.resolve(list[real]);
  },

  removeFromWishlist(uid, bookId) {
    const list = read(LS.WISHLISTS) || {};
    const real = normalizeUid(uid);

    list[real] = (list[real] || []).filter((x) => x !== bookId);
    write(LS.WISHLISTS, list);

    return Promise.resolve(list[real]);
  },

  getWishlist(uid) {
    return Promise.resolve((read(LS.WISHLISTS) || {})[normalizeUid(uid)] || []);
  },

  /* ------------------------------
        REQUESTS
  ------------------------------*/
  createRequest(req) {
    const reqs = read(LS.REQUESTS) || [];
    const real = normalizeUid(req.fromUid);

    const duplicate = reqs.some(
      (r) =>
        r.bookId === req.bookId &&
        r.fromUid === real &&
        !["Cancelled", "Returned", "Rejected"].includes(r.status)
    );

    if (duplicate) {
      alert("⚠️ You already requested this book.");
      return Promise.reject("Duplicate");
    }

    const newReq = {
      id: uid("req"),
      ...req,
      fromUid: real,
      status: "Pending",
      timeline: [{ ts: new Date().toISOString(), event: "Request Sent" }],
    };

    reqs.unshift(newReq);
    write(LS.REQUESTS, reqs);

    return Promise.resolve(newReq);
  },

  listOutgoingRequests(uid) {
    const reqs = read(LS.REQUESTS) || [];
    return Promise.resolve(reqs.filter((r) => r.fromUid === normalizeUid(uid)));
  },

  listIncomingRequests(uid) {
    const reqs = read(LS.REQUESTS) || [];
    return Promise.resolve(reqs.filter((r) => r.toUid === normalizeUid(uid)));
  },

  updateRequestStatus(reqId, status) {
    let reqs = read(LS.REQUESTS) || [];
    const idx = reqs.findIndex((r) => r.id === reqId);

    if (idx === -1) return Promise.reject("Request not found");

    if (status === "Cancelled") {
      reqs = reqs.filter((r) => r.id !== reqId);
      write(LS.REQUESTS, reqs);
      return Promise.resolve("Cancelled");
    }

    reqs[idx].status = status;
    reqs[idx].timeline.push({
      ts: new Date().toISOString(),
      event: status,
    });

    write(LS.REQUESTS, reqs);

    return Promise.resolve(reqs[idx]);
  },

  /* ------------------------------
      REVIEWS
   ------------------------------*/
  addReview(bookId, userId, text) {
    const reviews = read(LS.REVIEWS) || [];
    const users = read(LS.USERS) || [];
    const user = users.find((u) => u.uid === userId);

    const newReview = {
      id: uid("rev"),
      bookId,
      userId,
      userName: user?.name || "Unknown User",
      text,
      at: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    write(LS.REVIEWS, reviews);

    return Promise.resolve(newReview);
  },

  listReviews(bookId) {
    const reviews = read(LS.REVIEWS) || [];
    return Promise.resolve(reviews.filter((r) => r.bookId === bookId));
  },

  /* ------------------------------
          LIKES
    ------------------------------*/
  toggleLike(bookId, userId) {
    const likes = read(LS.LIKES) || {};
    const real = normalizeUid(userId);

    likes[bookId] = likes[bookId] || [];

    if (likes[bookId].includes(real)) {
      likes[bookId] = likes[bookId].filter((u) => u !== real);
    } else {
      likes[bookId].push(real);
    }

    write(LS.LIKES, likes);

    return Promise.resolve({
      count: likes[bookId].length,
      likedByMe: likes[bookId].includes(real),
    });
  },

  getLikes(bookId, userId = null) {
    const likes = read(LS.LIKES) || {};
    const real = normalizeUid(userId);
    const list = likes[bookId] || [];

    return Promise.resolve({
      count: list.length,
      likedByMe: list.includes(real),
    });
  },

  /* ------------------------------
          NOTIFICATIONS
    ------------------------------*/
  addNotification(userId, message, extra = {}) {
    const notes = read(LS.NOTIFICATIONS) || [];
    const newNote = {
      id: uid("note"),
      userId,
      message,
      seen: false,
      at: new Date().toISOString(),
      ...extra,
    };
    notes.unshift(newNote);
    write(LS.NOTIFICATIONS, notes);
    return Promise.resolve(newNote);
  },

  listNotifications(uid) {
    const notes = read(LS.NOTIFICATIONS) || [];
    return Promise.resolve(notes.filter((n) => n.userId === uid));
  },

  markNotificationsSeen(uid) {
    const notes = read(LS.NOTIFICATIONS) || [];
    notes.forEach((n) => {
      if (n.userId === uid) n.seen = true;
    });
    write(LS.NOTIFICATIONS, notes);
    return Promise.resolve(true);
  },

  // Create / List / Get events
  getEvent(id) {
    const events = read(LS.EVENTS) || [];
    return Promise.resolve(events.find((e) => e.id === id));
  },

  /* -------------------------
     LIST ALL EVENTS
  --------------------------*/
  listEvents(category = "all") {
    const events = read(LS.EVENTS) || [];
    if (category === "all") return Promise.resolve(events);
    return Promise.resolve(events.filter((e) => e.category === category));
  },

  /* -------------------------
     RSVP EVENT
  --------------------------*/
  rsvpEvent(eventId, user) {
    const events = read(LS.EVENTS) || [];
    const idx = events.findIndex((e) => e.id === eventId);
    if (idx === -1) return Promise.reject("Event not found");

    if (!events[idx].attendees.includes(user.uid)) {
      events[idx].attendees.push(user.uid);
      write(LS.EVENTS, events);
    }

    return Promise.resolve(events[idx]);
  },

  /* -------------------------
     ADD COMMENT TO EVENT
  --------------------------*/
  addEventComment(eventId, user, text) {
    const events = read(LS.EVENTS) || [];
    const idx = events.findIndex((e) => e.id === eventId);
    if (idx === -1) return Promise.reject("Event not found");

    const comment = {
      id: uid("comm"),
      userId: user.uid,
      userName: user.displayName || user.name || "User",
      text,
      at: new Date().toISOString(),
    };

    events[idx].comments.push(comment);
    write(LS.EVENTS, events);

    return Promise.resolve(comment);
  },

  /* -------------------------
     LIST COMMENTS
  --------------------------*/
  listEventComments(eventId) {
    const events = read(LS.EVENTS) || [];
    const event = events.find((e) => e.id === eventId);
    return Promise.resolve(event?.comments || []);
  },
};
