function compareEmail(email1, email2) {
    const email1bits = email1.split('.');
    const email2bits = email2.split('.');
    const email1first = email1bits[0];
    const email1last = email1bits.pop()
    const email2first = email2bits[0];
    const email2last = email2bits.pop();
    let comparison = email1last.localeCompare(email2last);
    if (comparison == 0) {
        comparison = email1first.localeCompare(email2first);
    }
    return comparison;
}

async function init() {
    let response;
    response = await fetch('markscheme.json');
    const markscheme = await response.json();
    const title = document.getElementById('title');
    title.innerHTML = markscheme.assignment;
    const studentsContainer = document.getElementById('students');
    response = await fetch('comments.csv');
    const externalComments = Papa.parse(await response.text(), { 'header': true });

    let students = [];
    let comments = {};
    for (let comment of externalComments.data) {
        if (comment.reviewee) {
            students.push(comment.reviewee);
            comments[reviewee] = comment;
        }
    }
    students = [...new Set(students)];
    students.sort(compareEmail);
    students.push('Extension');
    const studentBaseClass = 'student list-group-item';
    for (let student of students) {
        let studentDiv = document.createElement('li');
        studentDiv.innerHTML = student;
        studentDiv.className = studentBaseClass;
        studentsContainer.appendChild(studentDiv);
        studentDiv.addEventListener('click', function(ev){
            document.getElementsByClassName('student').array.forEach(element => {
                element.className = studendBaseClass; // remove any highlighting
            });
            ev.target.className = studenBaseClass + ' active';
        })

    }

    const studentDivs = document.getElementsByClassName('student');
    for(let studentDiv of studentDivs){

    }
}

init();