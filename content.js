let groups = [];
chrome.storage.sync.get("groups", t => {
    t.groups && (groups = t.groups, displayGroups(0)), new MutationObserver(function(t) {
        t.forEach(function(t) {
            "childList" !== t.type && "subtree" !== t.type || displayGroups(0)
        })
    }).observe(document.documentElement, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !0
    }), new MutationObserver(function(t) {
        t.forEach(function(t) {
            "childList" !== t.type && "subtree" !== t.type || addPlusButton()
        })
    }).observe(document.documentElement, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !0
    })
});
let newGroup = null,
    chatID = null,
    chatName = null;

function addPlusButton() {
    const t = document.querySelector("nav div.flex-col div.visible");
    if (!t) return;
    const e = t.closest("a");
    if (e.querySelector(".plus-button-extension")) return;
    const n = document.createElement("button");
    n.classList.add("p-1", "hover:text-white"), n.classList.add("plus-button-extension"), n.addEventListener("click", createPopup1);
    const o = createSVGPlus();
    n.appendChild(o), t.insertBefore(n, e.querySelector("button"));
    const r = new URL(window.location.href);
    newChatID = r.pathname.split("/")[2], null != newChatID && (chatID = newChatID);
    const s = e.querySelector(".text-ellipsis");
    chatName = s.textContent, e.querySelector(".flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative").classList.add("pr-[5.5rem]");
    const i = e.querySelector(".absolute.inset-y-0.right-0.w-8.z-10.bg-gradient-to-l.from-gray-800");
    i.classList.remove("w-8"), i.classList.add("w-16")
}

function createPopup1() {
    const t = document.createElement("div");
    t.classList.add("popup-container", "fixed", "top-0", "left-0", "w-screen", "h-screen", "flex", "items-center", "justify-center", "z-50"), t.style.backgroundColor = "rgba(200, 200, 200, 0.7)";
    const e = document.createElement("div");
    e.classList.add("p-4", "bg-gray-900", "rounded-md", "shadow-md"), e.style.minHeight = "150px", e.style.minWidth = "200px", e.style.color = "white";
    const n = document.createElement("div");
    n.textContent = "New Group", n.classList.add("pb-2", "border-b", "border-gray-300", "cursor-pointer", "px-1"), n.addEventListener("click", () => {
        closePopup(), createPopup2()
    });
    const o = document.createElement("div");
    o.classList.add("pt-2");
    for (const t of groups)
        if (!t.chats || !t.chats.hasOwnProperty(chatID)) {
            const e = document.createElement("div");
            e.classList.add("py-1", "px-1", "cursor-pointer", "rounded-md", "hover:bg-[#2A2B32]"), e.textContent = t.name, o.appendChild(e), e.addEventListener("click", () => {
                t.chats = t.chats || {}, t.chats[chatID] = chatName, closePopup(), chrome.storage.sync.set({
                    groups: groups
                }, () => {
                    displayGroups(1)
                })
            })
        } e.appendChild(n), e.appendChild(o), t.appendChild(e), document.body.appendChild(t), t.addEventListener("click", e => {
        e.target === t && closePopup()
    })
}

function createPopup2(t = !1, e = null) {
    const n = document.createElement("div");
    n.classList.add("popup-container", "fixed", "top-0", "left-0", "w-screen", "h-screen", "flex", "items-center", "justify-center", "z-50"), n.style.backgroundColor = "rgba(200, 200, 200, 0.7)";
    const o = document.createElement("div");
    o.classList.add("p-4", "bg-gray-900", "rounded-md", "shadow-md"), o.style.minHeight = "150px", o.style.minWidth = "200px", o.style.color = "white";
    const r = document.createElement("input");
    r.setAttribute("type", "text"), r.setAttribute("placeholder", t ? "Update Group Name" : "Name this Group"), r.classList.add("w-full", "border-gray-300", "rounded-md", "p-2", "mb-4", "bg-gray-900"), r.setAttribute("autofocus", ""), t && e && (r.value = e.name);
    const s = document.createElement("div");
    s.classList.add("flex", "justify-between");
    const i = [{
        name: "red",
        hex: "#EF4444"
    }, {
        name: "green",
        hex: "#22C55E"
    }, {
        name: "blue",
        hex: "#3B82F6"
    }, {
        name: "orange",
        hex: "#F28C28"
    }, {
        name: "purple",
        hex: "#9333EA"
    }, {
        name: "pink",
        hex: "#EC4899"
    }, {
        name: "cyan",
        hex: "#008B8B"
    }];
    for (const n of i) {
        const o = document.createElement("span");
        o.classList.add("h-5", "w-5", "rounded-full"), o.style.backgroundColor = n.hex, o.addEventListener("click", () => {
            for (const t of l) t.style.border = "2px solid transparent";
            o.style.border = "2px solid white", t && e ? e.color = n.hex : newGroup.color = n.hex
        }), s.appendChild(o)
    }
    const l = s.querySelectorAll("span"),
        a = Math.floor(Math.random() * l.length);
    if (t || (l[a].style.border = "2px solid white"), t && e) {
        const t = i.findIndex(t => t.hex === e.color);
        t >= 0 && (l[t].style.border = "2px solid white")
    }
    o.appendChild(r), o.appendChild(s), n.appendChild(o), document.body.appendChild(n), t || (newGroup = {
        id: generateUniqueId(),
        name: "no name",
        color: i[a].hex,
        chats: {
            [chatID]: chatName
        }
    }, groups.push(newGroup)), n.addEventListener("click", o => {
        if (o.target === n)
            if (closePopup(), t && e) {
                const t = groups.findIndex(t => t.id === e.id);
                t >= 0 && (groups[t] = {
                    ...e
                }, chrome.storage.sync.set({
                    groups: groups
                }, () => {
                    displayGroups(1)
                }))
            } else chrome.storage.sync.set({
                groups: groups
            }, () => {
                displayGroups(1)
            })
    }), r.addEventListener("input", n => {
        t && e ? e.name = n.target.value || "no name" : newGroup.name = n.target.value || "no name"
    })
}

function closePopup() {
    const t = document.querySelector(".popup-container");
    t && t.remove(), newGroup = null
}

function createGroupDiv(t) {
    const e = document.createElement("div");
    return e.classList.add("flex", "py-2", "px-3", "items-center", "gap-1", "relative", "rounded-md", "break-all", "group-extension", "mb-2", "cursor-pointer"), e.style.backgroundColor = t.color, e.setAttribute("data-group-id", t.id), e
}

function createChatATag(t, e) {
    const n = document.createElement("div");
    return n.classList.add("flex", "py-3", "px-3", "items-center", "gap-1", "relative", "rounded-md", "hover:bg-[#2A2B32]", "cursor-pointer", "break-all", "chat-extension"), n.href = "https://chat.openai.com/c/" + t, n.setAttribute("data-chat-id", t), n
}

function appendElementWithClasses(t, e, n, o = null) {
    const r = document.createElement(e);
    return r.classList.add(...n), o && (r.textContent = o), t.appendChild(r), r
}

function createButtonWithIcon(t, e, n, o = !1) {
    const r = appendElementWithClasses(t, "button", e);
    return r.appendChild(n()), o && (r.style.display = "none"), r
}


function displayGroups(t) {
    const e = document.querySelector("nav div.flex-col div.flex-col");
    if (!e) return;
    const n = e.querySelector(".groups-div-extension");
    if (0 == groups.length) return void(n && n.remove());
    if (n && 0 == t) return;
    n && 1 == t && n.remove();
    const o = appendElementWithClasses(e, "div", ["groups-div-extension", "border-b", "border-white/20", "relative", "z-50"]);
    groups.forEach(t => {
        const e = createGroupDiv(t),
            n = createSVGEllipse();
        e.appendChild(n);
        appendElementWithClasses(e, "div", ["flex-1", "text-ellipsis", "max-h-5", "overflow-hidden", "break-all", "relative"], t.name);
        const r = appendElementWithClasses(e, "div", ["flex", "right-1", "z-10"]),
            s = createButtonWithIcon(r, ["p-1", "hover:text-white", "no-toggle"], createSVGEdit),
            i = createButtonWithIcon(r, ["p-1", "hover:text-white", "no-toggle"], createSVGBin),
            l = createButtonWithIcon(r, ["p-1", "hover:text-white", "no-toggle"], createSVGConfirmation, !0),
            a = createButtonWithIcon(r, ["p-1", "hover:text-white", "no-toggle"], createSVGCancellation, !0);
        i.addEventListener("click", () => {
            i.style.display = "none", l.style.display = "", a.style.display = ""
        }), l.addEventListener("click", () => {
            const t = e.getAttribute("data-group-id"),
                n = groups.findIndex(e => e.id === t); - 1 !== n && groups.splice(n, 1), chrome.storage.sync.set({
                groups: groups
            }), e.remove(), u.remove()
        }), a.addEventListener("click", () => {
            l.style.display = "none", a.style.display = "none", i.style.display = ""
        }), s.addEventListener("click", () => {
            createPopup2(!0, t)
        });
        const c = createButtonWithIcon(r, ["p-1", "hover:text-white"], createSVGDownArrow);
        e.addEventListener("click", () => {
            event.target.classList.contains("no-toggle") || event.target.closest(".no-toggle") || ("none" === u.style.display ? (u.style.display = "block", c.classList.add("up-arrow")) : (u.style.display = "none", c.classList.remove("up-arrow")))
        }), o.appendChild(e);
        const u = appendElementWithClasses(o, "div", ["chats-extension"]);
        u.style.display = "none", o.appendChild(u), Object.entries(t.chats).forEach(([n, o]) => {
            const r = createChatATag(n, o),
                s = appendElementWithClasses(r, "div", ["flex-1", "text-ellipsis", "max-h-5", "overflow-hidden", "break-all", "relative"], o),
                i = appendElementWithClasses(r, "div", ["flex", "right-1", "z-10", "text-gray-300"]),
                l = document.createElement("input");
            l.classList.add("text-sm", "border-none", "bg-transparent", "p-0", "m-0", "w-full", "mr-0"), l.value = o;
            const a = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGEdit),
                c = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGBin),
                d = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGConfirmation, !0),
                p = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGCancellation, !0),
                h = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGConfirmation, !0),
                m = createButtonWithIcon(i, ["p-1", "hover:text-white"], createSVGCancellation, !0);
            a.addEventListener("click", () => {
                a.style.display = "none", h.style.display = "", m.style.display = "", s.replaceWith(l), l.focus()
            }), h.addEventListener("click", () => {
                s.textContent = l.value, l.replaceWith(s), h.style.display = "none", m.style.display = "none", a.style.display = "", t.chats[n] = l.value, chrome.storage.sync.set({
                    groups: groups
                })
            }), m.addEventListener("click", () => {
                h.style.display = "none", m.style.display = "none", a.style.display = "", l.value = s.textContent, l.replaceWith(s)
            }), c.addEventListener("click", () => {
                c.style.display = "none", d.style.display = "", p.style.display = ""
            }), d.addEventListener("click", () => {
                const t = r.getAttribute("data-chat-id"),
                    n = groups.findIndex(t => t.id === e.getAttribute("data-group-id")); - 1 !== n && (delete groups[n].chats[t], chrome.storage.sync.set({
                    groups: groups
                }), r.remove())
            }), p.addEventListener("click", () => {
                d.style.display = "none", p.style.display = "none", c.style.display = ""
            }), r.appendChild(i), r.addEventListener("click", t => {
                t.target === i || i.contains(t.target) || t.target === l || (window.location.href = "https://chat.openai.com/c/" + n)
            }), u.appendChild(r)
        })
    }), e.insertBefore(o, e.firstChild)
}

function createSVGPlus() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("stroke", "currentColor"), t.setAttribute("fill", "none"), t.setAttribute("stroke-width", "2"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), t.classList.add("h-4", "w-4", "height-1em", "width-1em");
    const e = document.createElementNS("http://www.w3.org/2000/svg", "line");
    e.setAttribute("x1", "12"), e.setAttribute("y1", "5"), e.setAttribute("x2", "12"), e.setAttribute("y2", "19");
    const n = document.createElementNS("http://www.w3.org/2000/svg", "line");
    return n.setAttribute("x1", "5"), n.setAttribute("y1", "12"), n.setAttribute("x2", "19"), n.setAttribute("y2", "12"), t.appendChild(e), t.appendChild(n), t
}

function createSVGEllipse() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("stroke", "currentColor"), t.setAttribute("fill", "none"), t.setAttribute("stroke-width", "2"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), t.setAttribute("height", "1em"), t.setAttribute("width", "1em"), t.setAttribute("class", "h-4 w-4 arrow-icon");
    const e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    e.setAttribute("x", "2"), e.setAttribute("y", "2"), e.setAttribute("width", "20"), e.setAttribute("height", "20"), e.setAttribute("rx", "2"), e.setAttribute("fill", "none"), t.appendChild(e);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "line");
    n.setAttribute("x1", "7"), n.setAttribute("y1", "12"), n.setAttribute("x2", "17"), n.setAttribute("y2", "12"), t.appendChild(n);
    const o = document.createElementNS("http://www.w3.org/2000/svg", "line");
    o.setAttribute("x1", "8"), o.setAttribute("y1", "8"), o.setAttribute("x2", "16"), o.setAttribute("y2", "8"), t.appendChild(o);
    const r = document.createElementNS("http://www.w3.org/2000/svg", "line");
    return r.setAttribute("x1", "8"), r.setAttribute("y1", "16"), r.setAttribute("x2", "16"), r.setAttribute("y2", "16"), t.appendChild(r), t
}

function createSVGDownArrow() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("stroke", "currentColor"), t.setAttribute("fill", "none"), t.setAttribute("stroke-width", "2"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), t.classList.add("h-4", "w-4"), t.setAttribute("height", "1em"), t.setAttribute("width", "1em");
    const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return e.setAttribute("d", "M6 9l6 6 6-6"), t.classList.add("arrow-icon"), t.appendChild(e), t
}

function createSVGUpArrow() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("stroke", "currentColor"), t.setAttribute("fill", "none"), t.setAttribute("stroke-width", "2"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), t.classList.add("h-4", "w-4"), t.setAttribute("height", "1em"), t.setAttribute("width", "1em");
    const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return e.setAttribute("d", "M18 15l-6-6-6 6"), t.appendChild(e), t
}

function createSVGBin() {
    const t = "http://www.w3.org/2000/svg",
        e = document.createElementNS(t, "svg");
    e.setAttributeNS(null, "stroke", "currentColor"), e.setAttributeNS(null, "fill", "none"), e.setAttributeNS(null, "stroke-width", "2"), e.setAttributeNS(null, "viewBox", "0 0 24 24"), e.setAttributeNS(null, "stroke-linecap", "round"), e.setAttributeNS(null, "stroke-linejoin", "round"), e.setAttributeNS(null, "class", "h-4 w-4"), e.setAttributeNS(null, "height", "1em"), e.setAttributeNS(null, "width", "1em");
    const n = document.createElementNS(t, "polyline");
    n.setAttributeNS(null, "points", "3 6 5 6 21 6"), e.appendChild(n);
    const o = document.createElementNS(t, "path");
    o.setAttributeNS(null, "d", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"), e.appendChild(o);
    const r = document.createElementNS(t, "line");
    r.setAttributeNS(null, "x1", "10"), r.setAttributeNS(null, "y1", "11"), r.setAttributeNS(null, "x2", "10"), r.setAttributeNS(null, "y2", "17"), e.appendChild(r);
    const s = document.createElementNS(t, "line");
    return s.setAttributeNS(null, "x1", "14"), s.setAttributeNS(null, "y1", "11"), s.setAttributeNS(null, "x2", "14"), s.setAttributeNS(null, "y2", "17"), e.appendChild(s), e
}

function createSVGConfirmation() {
    const t = "http://www.w3.org/2000/svg",
        e = document.createElementNS(t, "svg");
    e.setAttributeNS(null, "stroke", "currentColor"), e.setAttributeNS(null, "fill", "none"), e.setAttributeNS(null, "stroke-width", "2"), e.setAttributeNS(null, "viewBox", "0 0 24 24"), e.setAttributeNS(null, "stroke-linecap", "round"), e.setAttributeNS(null, "stroke-linejoin", "round"), e.setAttributeNS(null, "class", "h-4 w-4"), e.setAttributeNS(null, "height", "1em"), e.setAttributeNS(null, "width", "1em");
    const n = document.createElementNS(t, "polyline");
    return n.setAttributeNS(null, "points", "20 6 9 17 4 12"), e.appendChild(n), e
}

function createSVGCancellation() {
    const t = "http://www.w3.org/2000/svg",
        e = document.createElementNS(t, "svg");
    e.setAttributeNS(null, "stroke", "currentColor"), e.setAttributeNS(null, "fill", "none"), e.setAttributeNS(null, "stroke-width", "2"), e.setAttributeNS(null, "viewBox", "0 0 24 24"), e.setAttributeNS(null, "stroke-linecap", "round"), e.setAttributeNS(null, "stroke-linejoin", "round"), e.setAttributeNS(null, "class", "h-4 w-4"), e.setAttributeNS(null, "height", "1em"), e.setAttributeNS(null, "width", "1em");
    const n = document.createElementNS(t, "line");
    n.setAttributeNS(null, "x1", "18"), n.setAttributeNS(null, "y1", "6"), n.setAttributeNS(null, "x2", "6"), n.setAttributeNS(null, "y2", "18"), e.appendChild(n);
    const o = document.createElementNS(t, "line");
    return o.setAttributeNS(null, "x1", "6"), o.setAttributeNS(null, "y1", "6"), o.setAttributeNS(null, "x2", "18"), o.setAttributeNS(null, "y2", "18"), e.appendChild(o), e
}

function createSVGEdit() {
    const t = "http://www.w3.org/2000/svg",
        e = document.createElementNS(t, "svg");
    e.setAttribute("stroke", "currentColor"), e.setAttribute("fill", "none"), e.setAttribute("stroke-width", "2"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), e.setAttribute("class", "h-4 w-4"), e.setAttribute("height", "1em"), e.setAttribute("width", "1em");
    const n = document.createElementNS(t, "path");
    n.setAttribute("d", "M12 20h9"), e.appendChild(n);
    const o = document.createElementNS(t, "path");
    return o.setAttribute("d", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"), e.appendChild(o), e
}

function generateUniqueId() {
    return Date.now().toString()
}

function clearAllStorage() {
    chrome.storage.sync.clear(function() {
        console.log("Local storage cleared!")
    })
}
chrome.runtime.onMessage.addListener((t, e, n) => {
    if (t.payload) {
        let e = JSON.parse(t.payload).conversation_id;
        chatID = e
    }
});