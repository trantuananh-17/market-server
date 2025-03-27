const form = document.getElementById("form");
const messageTag = document.getElementById("message");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const notification = document.getElementById("notification");
const submitBtn = document.getElementById("submit");

form.style.display = "none";

let token, id;

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/;

window.addEventListener("DOMContentLoaded", async () => {
  // URLSearchParams(window.location.search)
  // example.com?param1=value1&param2=value2
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  token = params.token;
  id = params.id;

  const res = await fetch("/api/auth/verify-pass-reset-token", {
    method: "POST",
    body: JSON.stringify({ token, id }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const { message } = await res.json();
    messageTag.innerText = message;
    messageTag.classList.add("error");
    return;
  }

  messageTag.style.display = "none";
  form.style.display = "block";
});

const displayNotification = (message, type) => {
  notification.style.display = "block";
  notification.innerText = message;
  notification.className = ""; // Xóa tất cả class trước
  notification.classList.add(type);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!passwordRegex.test(password.value)) {
    return displayNotification(
      "Password must include: A-Z, a-z, 0-9, and special character (!@#$%^&*)",
      "error"
    );
  }

  if (password.value !== confirmPassword.value) {
    return displayNotification("Password do not match", "error");
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Please wait...";

  console.log(id, token, password.value);

  const res = await fetch("/api/auth/reset-pass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id, token, password: password.value }),
  });

  submitBtn.disabled = false;
  submitBtn.innerText = "Update Password";

  console.log(res);

  if (!res.ok) {
    const { message } = await res.json();
    return displayNotification(message, "error");
  }

  messageTag.style.display = "block";
  messageTag.innerText = "Your password updated successfully";

  form.style.display = "none";
};

form.addEventListener("submit", handleSubmit);
