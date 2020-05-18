import "prismjs";
import $ from "umbrellajs";

(function tableofcontents() {
  const headers = $("main h2, main h3");

  const plain = html => {
    var text = document.createTextNode(html);
    var p = document.createElement("p");
    p.appendChild(text);
    return p.innerHTML;
  };

  let toc = `
    <div class="entry primary">
      ${$(headers.first()).is("h3") ? '<label class="more"></label>' : ""}
      <a href="#top"><strong>${document.title}</strong></a>
    </div>
  `;
  headers.nodes.forEach((sec, i, secs) => {
    const $sec = $(sec);
    const around = [secs[i - 1], sec, secs[i + 1]];
    const [prev, level, next] = around.map(
      sec => sec && ($(sec).is("h2") ? "primary" : "secondary")
    );

    if (
      (prev === "primary" && level === "secondary") ||
      (!prev && level === "secondary")
    ) {
      toc += `<section>`;
    }

    toc += `
      <div class="entry ${level}">
        ${
          level === "primary" && next === "secondary"
            ? '<label class="more"></label>'
            : ""
        }
        <a href="#${$sec.attr("id")}">${plain($sec.text())}</a>
      </div>
    `;

    if (
      (level === "secondary" && next === "primary") ||
      (level === "secondary" && !next)
    ) {
      toc += `</section>`;
    }
  });

  $("aside").html(toc);
})();

$("a").on("click", e => {
  const href = $(e.currentTarget).attr("href");

  // Only for relative links
  if (!/^#/.test(href)) return;

  e.preventDefault();

  if (href === "#top") {
    history.replaceState(null, null, "/");
    $("body").scroll();
  } else {
    history.replaceState(null, null, href);
    $(href).scroll();
  }
  $(e.currentTarget)
    .closest(".entry")
    .addClass("active");
});

// Show more/less when clicking the chevron
$("aside .more").handle("click", e => {
  $(e.currentTarget)
    .closest(".entry")
    .toggleClass("active");
});

// Timeout to direct the attention here
setTimeout(() => {
  // Show the first one
  const first = $("aside .more").first();
  if (first) first.click();

  // Show the menu of the one in the URL (if any)
  const hash = window.location.hash;
  if (hash) {
    const link = $("aside a").filter(node => $(node).attr("href") === hash);
    if (link.is(".primary")) {
      link.closest(".entry").addClass("active");
    } else {
      link
        .closest("section")
        .map(node => node.previousElementSibling)
        .addClass("active");
    }
  }
}, 1000);
