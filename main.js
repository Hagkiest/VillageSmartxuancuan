/* ============================================================
   Hispirit 农村村务管理系统 - 交互脚本
   - 亮/暗模式切换 + 持久化
   - 导航栏滚动效果
   - 移动端菜单
   - 复制QQ号
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 亮/暗模式切换 ---------- */
  const THEME_KEY = "hispirit-theme";
  const root = document.documentElement;

  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // 初始化主题（DOMContentLoaded 前就设置好，避免闪烁）
  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- 主题切换按钮 ---------- */
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    }

    /* ---------- 导航栏滚动效果 ---------- */
    const header = document.getElementById("siteHeader");
    if (header) {
      const onScroll = function () {
        if (window.scrollY > 10) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------- 移动端菜单 ---------- */
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.querySelector(".main-nav");
    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.setAttribute(
          "aria-label",
          isOpen ? "关闭菜单" : "打开菜单"
        );
      });

      mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mainNav.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  });

  /* ---------- 复制QQ号 ---------- */
  window.copyQQ = function () {
    const qqEl = document.getElementById("qqNumber");
    if (!qqEl) return;
    const qq = qqEl.textContent.trim();

    // 优先使用 clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(qq).then(function () {
        showToast("QQ号 " + qq + " 已复制到剪贴板");
      }).catch(function () {
        fallbackCopy(qq);
      });
    } else {
      fallbackCopy(qq);
    }
  };

  function fallbackCopy(text) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("QQ号 " + text + " 已复制到剪贴板");
    } catch (err) {
      showToast("复制失败，请手动复制QQ号：" + text);
    }
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.background = "";
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }
})();
