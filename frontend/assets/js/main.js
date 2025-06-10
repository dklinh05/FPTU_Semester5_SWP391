
document.addEventListener("DOMContentLoaded", () => {

  const preloader = document.getElementById("preloader");
  const mainWrapper = document.getElementById("main-wrapper");
  const collapseSidebar = document.querySelector(".collapse-sidebar");
  const collapseMainContent = document.querySelector(".content-wrapper");
  const sidebar = document.querySelector(".sidebar");
  const submenuParents = document.querySelectorAll(".submenu-parent");
  const icon = document.querySelector(".collapse-sidebar i");
  const menuToggle = document.querySelector(".menu-toggle");
  const selectAllCheckbox = document.getElementById('select-all');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const editor = document.querySelector('#editor');
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const browseButton = document.getElementById("browseButton");
  const variantsTable = document.getElementById("variants-table");
  const addVariantButton = document.getElementById("add-variant");
  const printInvoicetButton = document.getElementById("printInvoice");
  const browsedatatable = document.getElementById("datatable");
  const header = document.querySelector(".header");


  
  // Preloader for first-time visitors
//   const isFirstVisit = !localStorage.getItem("visited");
//   if (isFirstVisit) {
//       setTimeout(() => {
//           preloader.style.display = "none";
//           mainWrapper.style.display = "block";
//           localStorage.setItem("visited", "true");
//       }, 3000);
//   } else {
//       preloader.style.display = "none";
//       mainWrapper.style.display = "block";
//   }


if(preloader){
  setTimeout(() => {
    preloader.style.display = "none";
    mainWrapper.style.display = "block";
  }, 100)
}

  // Submenu toggle
  if (submenuParents) {
    submenuParents.forEach((parent) => {
      parent.addEventListener("click", (e) => {
          e.preventDefault();
          const submenu = parent.nextElementSibling;
          const rightIcon = parent.querySelector(".right-icon");

          parent.classList.toggle("active");
          submenu.classList.toggle("open");
          rightIcon.classList.toggle("rotate");
      });
  });
  }
  

let isCollapsedManually = false;
let collapseClickCount = 0;

if (collapseSidebar) {
  collapseSidebar.addEventListener("click", () => {
    collapseClickCount++;
    const isDoubleClick = collapseClickCount === 2;

    if (isDoubleClick) {
      collapseClickCount = 0;
      isCollapsedManually = false;
      sidebar.classList.remove("sidebar-collapsed");
      icon.classList.remove("icon-rotated");
      collapseMainContent.classList.remove("collapse-main-collapsed");
      collapseMainContent.classList.add("collapse-main-expanded");
      header.classList.remove("header-collapsed");
      header.classList.add("header-expanded");
      icon.classList.remove('fa-arrow-right');
      icon.classList.add('fa-bars');
    } else {
      isCollapsedManually = true;
      sidebar.classList.add("sidebar-collapsed");
      icon.classList.add("icon-rotated");
      collapseMainContent.classList.add("collapse-main-collapsed");
      collapseMainContent.classList.remove("collapse-main-expanded");
      header.classList.add("header-collapsed");
      header.classList.remove("header-expanded");
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-arrow-right');
    }
  });
}

if (sidebar) {
  sidebar.addEventListener("mouseenter", () => {
    if (sidebar.classList.contains("sidebar-collapsed")) {
      sidebar.classList.remove("sidebar-collapsed");
      icon.classList.remove("icon-rotated");
      collapseMainContent.classList.add("collapse-main-expanded");
      collapseMainContent.classList.remove("collapse-main-collapsed");
      header.classList.add("header-expanded");
      header.classList.remove("header-collapsed");
    }
  });

  sidebar.addEventListener("mouseleave", () => {
    if (!sidebar.classList.contains("sidebar-collapsed") && isCollapsedManually) {
      sidebar.classList.add("sidebar-collapsed");
      icon.classList.add("icon-rotated");
      collapseMainContent.classList.remove("collapse-main-expanded");
      collapseMainContent.classList.add("collapse-main-collapsed");
      header.classList.remove("header-expanded");
      header.classList.add("header-collapsed");
    }
  });
}

// Overlay handling
const overlay = document.createElement("div");
overlay.classList.add("overlay-hidden");
document.body.appendChild(overlay);

let mobileOverlayVisible = false;

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    if (!mobileOverlayVisible) {
      sidebar.classList.add("sidebar-visible");
      overlay.classList.remove("overlay-hidden");
      overlay.classList.add("overlay-visible");
      mobileOverlayVisible = true;
    } else {
      closeSidebar();
    }
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    if (mobileOverlayVisible) {
      closeSidebar();
    }
  });
}

function closeSidebar() {
  sidebar.classList.remove("sidebar-visible");
  overlay.classList.remove("overlay-visible");
  overlay.classList.add("overlay-hidden");
  mobileOverlayVisible = false;
}

const handleResize = () => {
  if (window.innerWidth >= 993) {
    collapseMainContent.classList.remove("collapse-main-expanded");
    header.classList.remove("header-expanded");
    sidebar.classList.remove("sidebar-collapsed");
    collapseMainContent.classList.remove("collapse-main-collapsed");
    header.classList.remove("header-collapsed");
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-arrow-right');
    isCollapsedManually = false;
    closeSidebar();
  } else {
    collapseMainContent.classList.remove("collapse-main-expanded");
    header.classList.remove("header-expanded");
    sidebar.classList.remove("sidebar-collapsed");
    collapseMainContent.classList.remove("collapse-main-collapsed");
    header.classList.remove("header-collapsed");
    closeSidebar();
    isCollapsedManually = false;
  }
};

// Attach the resize event listener
window.addEventListener("resize", handleResize);

if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', function () {
    rowCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });
}


if (rowCheckboxes) {
  rowCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const allChecked = Array.from(rowCheckboxes).every((checkbox) => checkbox.checked);
      selectAllCheckbox.checked = allChecked;
    });
  });
}



// Initialize CKEditor 5
if (editor) {
  ClassicEditor.create(editor)
    .then(editorInstance => {
      const editableElement = editorInstance.ui.view.editable.element;

      editableElement.style.minHeight = '300px';

      editableElement.addEventListener('focus', () => {
        editableElement.style.minHeight = '300px';
      });

      editableElement.addEventListener('blur', () => {
        editableElement.style.minHeight = '300px';
      });

      document.addEventListener('click', (event) => {
        if (!editableElement.contains(event.target)) {
          editableElement.style.minHeight = '300px';
        }
      });

    })
    .catch(error => {
      console.error('Error initializing CKEditor 5', error);
    });
}


if(dropzone){
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#6c63ff";
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#d3d3d3";
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#d3d3d3";
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  browseButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);
    handleFiles(files);
  });
}



  function handleFiles(files) {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewItem = document.createElement("div");
          previewItem.className = "preview-item";

          const img = document.createElement("img");
          img.src = e.target.result;

          const actions = document.createElement("div");
          actions.className = "actions";

          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
          deleteBtn.onclick = () => previewItem.remove();

          actions.appendChild(deleteBtn);

          previewItem.appendChild(img);
          previewItem.appendChild(actions);
          preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      }
    });
  }


let variants = [
  {
    size: "Choose Size",
    color: "Choose Color",
    price: "210.10",
    quantity: 2,
    image: "./assets/icons/image-icon.svg",
  }
];

// Render table rows using append
const renderVariants = () => {
  // Clear the table
  variantsTable.innerHTML = '';
  
  // Loop through the variants array and append rows
  variants.forEach((variant, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <label>
          <img src="${variant.image}" class="image-preview" style="width: 50px; height: 50px; object-fit: cover;" alt="Preview">
          <input type="file" class="file-input" multiple data-index="${index}" accept="image/*" style="display: none;">
        </label>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="size">
          <option ${variant.size === "Choose Size" ? "selected" : ""}>Choose Size</option>
          <option ${variant.size === "S" ? "selected" : ""}>S</option>
          <option ${variant.size === "M" ? "selected" : ""}>M</option>
          <option ${variant.size === "L" ? "selected" : ""}>L</option>
        </select>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="color">
          <option ${variant.color === "Choose Color" ? "selected" : ""}>Choose Color</option>
          <option ${variant.color === "Red" ? "selected" : ""}>Red</option>
          <option ${variant.color === "Blue" ? "selected" : ""}>Blue</option>
          <option ${variant.color === "Green" ? "selected" : ""}>Green</option>
        </select>
      </td>
      <td width="200px"><input type="text" class="form-control" value="${variant.price}" data-index="${index}" data-field="price"></td>
      <td>
        <div class="d-flex">
          <div class="counter-container">
            <input type="number" class="counter-input" value="${variant.quantity}" readonly>
            <div>
              <a href="javascript:void(0)" class="counter-btn" data-action="decrease" data-index="${index}">-</a>
              <a href="javascript:void(0)" class="counter-btn" data-action="increase" data-index="${index}">+</a>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn btn-sm text-danger" data-index="${index}"><i class="fa-solid fa-trash"></i></a>
        </div>
      </td>
    `;

    variantsTable.append(row);
  });
};

if(addVariantButton){
// Add new variant
addVariantButton.addEventListener("click", () => {
  variants.push({
    size: "Choose Size",
    color: "Choose Color",
    price: "0.00",
    quantity: 0,
    image: "./assets/icons/image-icon.svg",
  });
  renderVariants();
});
}


// Delete a variant
if(variantsTable){
  variantsTable.addEventListener("click", (e) => {
    const deleteButton = e.target.closest("[data-index]");
    if (deleteButton && deleteButton.querySelector("i.fa-trash")) {
      const index = deleteButton.dataset.index;
      variants.splice(index, 1);
      renderVariants();
    }
  });

  
// Adjust quantity
variantsTable.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (e.target.matches("[data-action='increase']")) {
    variants[index].quantity++;
    renderVariants();
  } else if (e.target.matches("[data-action='decrease']") && variants[index].quantity > 0) {
    variants[index].quantity--;
    renderVariants();
  }
});

// Handle file upload and preview
variantsTable.addEventListener("change", (e) => {
  if (e.target.matches(".file-input")) {
    const index = e.target.dataset.index;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        variants[index].image = reader.result;
        renderVariants();
      };
      reader.readAsDataURL(file);
    }
  }
});

// Handle changes to inputs/selects
variantsTable.addEventListener("input", (e) => {
  const index = e.target.dataset.index;
  const field = e.target.dataset.field;
  if (index !== undefined && field) {
    variants[index][field] = e.target.value;
  }
});


// Initial render
renderVariants();

}





// initialize Tagify
var inputTags = document.querySelector('#inputTags');

if(inputTags){
  var tagify = new Tagify(inputTags);
  tagify.DOM.input.blur();
}

if(printInvoicetButton){
  printInvoicetButton.addEventListener("click", (e) => {

    var printContent = document.getElementById('invoice-section');
    var printDiv = document.createElement('div');
    printDiv.id = 'printDiv';
    printDiv.innerHTML = printContent.innerHTML;
    document.body.appendChild(printDiv);
    var style = document.createElement('style');
    style.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
            }
            #printDiv, #printDiv * {
                visibility: visible;
            }
            #printDiv {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                max-width: 100%;
                height: auto;
                margin: 0;
                padding: 0;
            }
            .container, .card, .card-body {
                page-break-inside: avoid;
            }
            table {
                width: 100%;
                page-break-inside: auto;
            }
            .table th, .table td {
                white-space: nowrap;
            }
        }
    `;
    document.head.appendChild(style);
    window.print();
    document.body.removeChild(printDiv);
    document.head.removeChild(style);
    });
    
}

$('.toggle-password').click(function() {
  var input = $(this).siblings('.input-password');
  var isPassword = input.attr('type') === 'password';

  // Toggle input type
  input.attr('type', isPassword ? 'text' : 'password');

  // Toggle icon based on input type
  var icon = isPassword 
      ? `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
          </svg>` 
      : `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>`;
  
  $(this).html(icon);
});


if(browsedatatable){
  new DataTable(browsedatatable);
}



//// Profile Settings

document.addEventListener("change", (event) => {
  if (!event.target.classList.contains("uploadProfileInput")) return;

  const triggerInput = event.target;
  const holder = triggerInput.closest(".pic-holder");
  const wrapper = triggerInput.closest(".profile-pic-wrapper");
  const currentImg = holder.querySelector(".pic").src;

  wrapper.querySelectorAll('[role="alert"]').forEach((alert) => alert.remove());

  triggerInput.blur();

  const files = triggerInput.files || [];
  if (!files.length || !window.FileReader) return;

  const file = files[0];
  if (!/^image/.test(file.type)) {
    showAlert(wrapper, "Please choose a valid image.", "alert-danger");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    holder.classList.add("uploadInProgress");
    holder.querySelector(".pic").src = reader.result;

    const loader = createLoader();
    holder.appendChild(loader);

    setTimeout(() => {
      holder.classList.remove("uploadInProgress");
      loader.remove();

      const isSuccess = Math.random() < 0.9;
      if (isSuccess) {
        showAlert(
          wrapper,
          '<i class="fa fa-check-circle text-success"></i> Profile image updated successfully',
          "snackbar"
        );
        triggerInput.value = "";
      } else {
        holder.querySelector(".pic").src = currentImg;
        showAlert(
          wrapper,
          '<i class="fa fa-times-circle text-danger"></i> There was an error while uploading! Please try again later.',
          "snackbar"
        );
        triggerInput.value = "";
      }
    }, 1500);
  };
});

/**
 * Utility function to show alerts
 * @param {HTMLElement} wrapper - The wrapper element to append the alert
 * @param {string} message - The alert message
 * @param {string} alertClass - The CSS class for the alert
 */
const showAlert = (wrapper, message, alertClass) => {
  const alert = document.createElement("div");
  alert.className = `${alertClass} show`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = message;
  wrapper.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
};

/**
 * Utility function to create a loader element
 * @returns {HTMLDivElement} - The loader element
 */
const createLoader = () => {
  const loader = document.createElement("div");
  loader.className = "upload-loader";
  loader.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';
  return loader;
};


});




