console.log("guestbook_function.js loaded");

fetch("/api/guestbook")
.then((res) => res.json())
.then((guestbookContents) => {
    renderGuestbook(guestbookContents);
});

function renderGuestbook(guestbookContentsArray) {
    guestbookContentsArray.sort((a, b) => b.content.date - a.content.date);
    
    guestbookContentsArray.map((element) => {
        const listItem = document.createElement("p");

        // formating date syntax from i.e. 20240111 to 2024-01-11:
        const year = element.content.date.slice(0, 4);
        const month = element.content.date.slice(4, 6);
        const day = element.content.date.slice(6, 8);
        const hour = element.content.date.slice(8, 10);
        const minute = element.content.date.slice(10, 12);
        const formatedDate = `${year}-${month}-${day} ${hour}:${minute}`;

        listItem.innerHTML = `<span class="userName">${element.name} wrote: </span><span class="userComment">${element.content.text}</span> - <span class="userDate">${formatedDate}</span>`;
        document.body.querySelector(".commentContainer").append(listItem);
        return element;
    });
}