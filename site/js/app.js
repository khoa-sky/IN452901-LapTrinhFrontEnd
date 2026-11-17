// Câu 2: viết JavaScript tại đây

const API_URL = "http://localhost:4000";

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Lấy các phần tử DOM
const searchForm = document.querySelector("#search-form");
const keywordInput = document.querySelector("#keyword");
const statusEl = document.querySelector("#status");
const eventListEl = document.querySelector("#event-list");
// Câu 2a (1,0 điểm): Hàm formatSeats(event)
const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  if (remaining <= 0) {
    return "Hết chỗ";
  }
  return `Còn ${remaining}/${event.capacity} chỗ`;
};
// Hàm phụ tạo một card <article> bằng createElement + textContent + setAttribute
const createEventCard = (event) => {
  const article = document.createElement("article");
  article.setAttribute("class", "card");
  // 1. Ảnh có alt
  const img = document.createElement("img");
  img.setAttribute("class", "card__media");
  img.setAttribute("src", "img/event.svg");
  img.setAttribute("alt", event.name);
  // 2. Thân card
  const body = document.createElement("div");
  body.setAttribute("class", "card__body");
  // 3. Tên sự kiện là liên kết event-detail.html?id=...
  const title = document.createElement("h2");
  title.setAttribute("class", "card__title");
  const link = document.createElement("a");
  link.setAttribute(
    "href",
    `event-detail.html?id=${encodeURIComponent(event.id)}`,
  );
  link.textContent = event.name;
  title.append(link);
  // 4. Giờ trong <time datetime="...">
  const info = document.createElement("p");
  info.setAttribute("class", "card__info");
  const time = document.createElement("time");
  time.setAttribute("datetime", event.startTime);
  time.textContent = formatDateTime(event.startTime);
  info.append(time);
  // 5. Địa điểm
  const location = document.createElement("p");
  location.setAttribute("class", "card__location");
  location.textContent = event.location;
  // 6. Số chỗ (nếu hết chỗ thì gắn nhãn .badge-full)
  const seats = document.createElement("p");
  seats.setAttribute("class", "card__seats");
  const seatText = formatSeats(event);
  if (seatText === "Hết chỗ") {
    const badge = document.createElement("span");
    badge.setAttribute("class", "badge-full");
    badge.textContent = seatText;
    seats.append(badge);
  } else {
    seats.textContent = seatText;
  }
  body.append(title, info, location, seats);
  article.append(img, body);
  return article;
};
// Câu 2b (2,0 điểm): Hàm renderEvents(events)
const renderEvents = (events) => {
  const cards = events.map((event) => createEventCard(event));
  eventListEl.replaceChildren(...cards);
};
// Câu 2c (2,0 điểm): Hàm async loadEvents(keyword)
const loadEvents = async (keyword = "") => {
  const params = new URLSearchParams({ pageSize: "50" });
  if (keyword) {
    params.set("q", keyword);
  }
  statusEl.textContent = "Đang tải…";
  try {
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    renderEvents(data.items);
    if (data.items.length === 0) {
      statusEl.textContent = "Không có sự kiện nào khớp từ khoá.";
    } else {
      statusEl.textContent = `Tìm thấy ${data.items.length} sự kiện`;
    }
  } catch {
    eventListEl.replaceChildren();
    statusEl.textContent = "Không tải được dữ liệu, vui lòng thử lại.";
  }
};
// Bắt sự kiện gửi form: chặn tải lại trang và cắt khoảng trắng từ khoá
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = keywordInput.value.trim();
  loadEvents(keyword);
});
// Gọi khi mở trang
loadEvents("");
