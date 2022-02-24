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

function text2ID(text) {
  // alphanumeric only
  return text.replace(/\W/g, '');
}

async function init() {
  let response;
  response = await fetch('markscheme.json');
  const markscheme = await response.json();
  const title = document.getElementById('title');
  title.innerHTML = markscheme.assignment;

  const accordion = document.getElementById('feedback_options_accordion');
  const feedback = document.getElementById('feedback');
  const sections = markscheme.sections;
  const schemes = markscheme.schemes;

  // from https://getbootstrap.com/docs/5.0/components/accordion/

  function sectionContent(section, parentSectionID) {
    let content = '';
    const sectionID = text2ID(section.title);
    let schemeName = section.scheme;
    if (schemeName) {
      const scheme = schemes[schemeName];
      content += `<div><select name="${sectionID}_${schemeName}" id="${sectionID}_${schemeName}">`;
      content += '<option></option>';
      for (let option of scheme.options) {
        let markText = option.mark ? `(${option.mark})` : '';
        content += `<option value="${section.title}: ${option.description} ${markText}">${option.description}</option>`;
      }
      content += '</select></div>';
      if (section.sections) {
        for (let subsection of section.sections) {
          content += `<h4>${subsection.title}</h4>`;
          content += sectionContent(subsection, parentSectionID);
        }
      }
    }
    if (section.comments) {
      for (let comment of section.comments) {
        // from https://getbootstrap.com/docs/5.0/forms/checks-radios/
        let commentID = text2ID(comment)
        content += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="* ${comment}" name="comment_${commentID}" id="check_${commentID}">
          <label class="form-check-label" for="check_${commentID}">
            ${comment}
          </label>
        </div>`;
      }
    }
    return content;
  }

  let sectionIDs = [];
  for (let section of sections) {
    let sectionID = text2ID(section.title);
    sectionIDs.push(sectionID);
    let hID = `heading_${sectionID}`;
    let cID = `collapse_${sectionID}`;
    let fID = `form_${sectionID}`;
    let sID = `submit_${sectionID}`;
    let accordionItem = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="${hID}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${cID}">
            ${section.title}
          </button>
        </h2>
        <div id="${cID}" class="accordion-collapse collapse" data-bs-parent="#feedback_options_accordion">
          <div class="accordion-body">
          <form id="${fID}">
            ${sectionContent(section, sectionID)}
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
          </div>
        </div>
      </div>
        `;
    accordion.innerHTML += accordionItem;
    feedback.innerHTML += `<h2>${section.title}</h2><div id="feedback_${sectionID}"></div>`;
  }

  // need another loop because when innerHTML is updated the forms get recreated, and the event handlers lost
  // could maybe use insertAdjacentHTML instead
  for(let sectionID of sectionIDs){
    let sectionForm = document.getElementById(`form_${sectionID}`);
    let sectionFeedback = document.getElementById(`feedback_${sectionID}`);
    sectionForm.addEventListener('submit', function (event) {
      event.preventDefault();
      let formContent = new FormData(sectionForm);
      sectionFeedback.innerHTML = '';
      for (let pair of formContent.entries()) {
        sectionFeedback.innerHTML += `<div>${pair[1]}<div>`;
      }
    });
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