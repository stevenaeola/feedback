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

    const accordion = document.getElementById('feedback_options_accordion');
    const sections = markscheme.sections;

    // from https://getbootstrap.com/docs/5.0/components/accordion/

    for (let section of sections) {
        let sectionID = section.title.replace(/ /g, '');
        let hID = `heading_${sectionID}`;
        let cID = `collapse_${sectionID}`;
        let accordionItem = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="${hID}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${cID}">
            ${section.title}
          </button>
        </h2>
        <div id="${cID}" class="accordion-collapse collapse" data-bs-parent="#feedback_options_accordion">
          <div class="accordion-body">
            Comments for ${section.title}
          </div>
        </div>
      </div>
        `;
        accordion.innerHTML += accordionItem;
    }

    const studentSelector = document.getElementById('student_selector');
    response = await fetch('comments.csv');
    const externalComments = Papa.parse(await response.text(), { 'header': true });

    let students = [];
    let comments = {};
    for (let comment of externalComments.data) {
        let reviewee = comment.reviewee;
        if (reviewee) {
            students.push(reviewee);
            if (comments[reviewee]) {
                comments[reviewee].push(comment);
            } else {
                comments[reviewee] = [comment];
            }
        }
    }
    students = [...new Set(students)];
    students.sort(compareEmail);
    students.push('Extension');
    for (let student of students) {
        let studentOption = document.createElement('option');
        studentOption.innerHTML = student;
        studentSelector.appendChild(studentOption);
    }
}

init();