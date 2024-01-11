function addNewComment() {
    const userName = document.body.querySelector(".inputName").value;
    const userComment = document.body.querySelector(".inputComment").value;
    const currentDate = new Date()
    let year = currentDate.getFullYear().toString();
    let month = (currentDate.getMonth()+1).toString();
    if (Number(month) < 10) {
        month = "0" + month;
    }
    let day = currentDate.getDate().toString();
    if (Number(day) < 10) {
        day = "0" + day;
    }
    let hour = currentDate.getHours().toString();
    if (Number(hour) < 10) {
        hour = "0" + hour;
    }
    let minute = currentDate.getMinutes().toString();
    if (Number(minute) < 10) {
        minute = "0" + minute;
    }
    const userDate = year+month+day+hour+minute;
    console.log(userDate);

    const newUserEntry = { name: userName, content: {text: userComment, date: userDate}};

    fetch("/api/guestbook", {
        method: "POST",
        body: JSON.stringify(newUserEntry),
    })
    .then((res) => res.json())
    .then((data) => {
        window.location.href = "/index.html";
    })
}