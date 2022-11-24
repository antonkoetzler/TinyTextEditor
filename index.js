var currentTab;

function toggleDropdown(id) {
  const display = $(id).css("display");
  cleanDropdowns();
  if(display == "none") $(id).css("display", "block");
  else                  $(id).css("display", "none");
}

function cleanDropdowns() {
  $("#file").css("display", "none");
  $("#view").css("display", "none");
}

function newTab() {
  // To set the font size to the current font size
  let currentFontSize = undefined;
  if ($("main").children().length > 0)
    currentFontSize = $("textarea").css("font-size");

  // Getting new tab number
  const newTabNumber = $("main").children().length;
  $("main").append("<textarea id='" + newTabNumber + "' onkeydown='textareaKeyDown(event, event.key)'></textarea>");
  $("main").children()[$("main").children().length - 1].focus();
  if (currentFontSize != undefined)
    $("textarea").css("font-size", currentFontSize);
  currentTab = newTabNumber;
}

function closeTab() {
  $("main").children('#' + currentTab).remove();
}

function zoomOut() {
  const fontsize = $("textarea").css("font-size");
  if(fontsize == undefined) return;
  const newSize = (Number(fontsize.substr(0, fontsize.length - 2)) - 10) + "px";
  $("textarea").css("font-size", newSize);
}

function zoomIn() {
  const fontsize = $("textarea").css("font-size");
  if(fontsize == undefined) return;
  const newSize = (Number(fontsize.substr(0, fontsize.length - 2)) + 10) + "px";
  $("textarea").css("font-size", newSize);
}

function openFile() {
  $("input").click();
}

function toggleAbout() {
  if($("#about").css("display") == "flex") $("#about").css("display", "none");
  else                  $("#about").css("display", "flex");
}

function save() {
  if (currentTab == undefined) return;
  const text = $("main").children()[currentTab].value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "File.txt");
}

function textareaKeyDown(event, key) {
  if (key == "Tab") {
    event.preventDefault();
    // Current <textarea>
    const textarea = $("main").children()[currentTab];
    // Where the cursor is in the text
    const selectionStart = textarea.selectionStart;
    
    const textStart = textarea.value.substr(0, selectionStart);
    const textEnd = textarea.value.substr(selectionStart);

    // Applying indentation
    textarea.value = textStart + "  " + textEnd;
    textarea.selectionStart = selectionStart + 2;
    textarea.selectionEnd   = selectionStart + 2;
  }
}

$(document).ready(() => {
  // Global click event (used to clean open dropdown menus)
  $(document).click((event) => {
    if(event.target.tagName != "BUTTON")
      cleanDropdowns();

    // Setting tab number
    if(event.target.tagName == "TEXTAREA")
      currentTab = event.target.id;
  });

  // Global keydown event (for keyboard shortcuts)
  $(document).keydown((event) => {
    if(event.ctrlKey) {
      switch(event.key.toUpperCase()) {
        case '[':
          event.preventDefault();
          openFile();
          break;
        case 'Y':
          event.preventDefault();
          newTab();
          break;
        case 'X':
          event.preventDefault();
          closeTab();
          break;
        case 'S':
          event.preventDefault();
          save();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          break;
        case '=':
          event.preventDefault();
          zoomIn();
          break;
        case ']':
          event.preventDefault();
          toggleAbout();
          break;
      }
    }
  });

  $("input").change((event) => {
    const file = new FileReader();
    file.onload = () => {
      newTab();
      $("main").children('#' + currentTab).val(file.result);
    };
    file.readAsText(event.target.files[0]);
  });
});
