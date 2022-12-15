let btn = document.getElementById('btn-action');
let listBookmarks = document.getElementById('list-bookmarks');
var arrVal = [];
var checkedItems = [];

// Add search input
let inputSearch = document.createElement('input');
inputSearch.classList.add('input-search');
inputSearch.placeholder = 'Enter key to search bookmarks..';
inputSearch.addEventListener('keyup', function () {
    let thisVal = this.value;
    thisVal = thisVal.toLowerCase();
    arrVal.filter(function (arrFilter) {
        let arrFilterVal = arrFilter['val'];
        arrFilterVal = arrFilterVal.toLowerCase();
        if (arrFilterVal.indexOf(thisVal) === -1) {
            document.getElementById("item-bookmark-" + arrFilter['id']).style.display = 'none';
        } else {
            document.getElementById("item-bookmark-" + arrFilter['id']).style.display = 'block';
        }
    });
});
listBookmarks.append(inputSearch);

// Add button remove
let btnRemove = document.createElement("button");
btnRemove.innerHTML = "Remove selected items";

btnRemove.addEventListener("click", function () {
    let warningPromt = confirm("Are you sure?");

    if (warningPromt != null) {
        for (var j =  0; j < checkedItems.length; j ++) {
            let idRemoved = checkedItems[j];
            chrome.bookmarks.remove(idRemoved, function () {
                checkedItems.splice(j, 1);
                console.log("removed bookmark id: " + idRemoved);
                document.getElementById("item-bookmark-" + idRemoved).style.display = "none";
            });
        }
    }
});

listBookmarks.append(btnRemove);

if (!listBookmarks.classList.contains('loaded-full-bookmarks')) {
    chrome.bookmarks.getTree( process_bookmark );
} else {
    listBookmarks.classList.remove('loaded-full-bookmarks');
    listBookmarks.innerHTML = '';
    chrome.bookmarks.getTree( process_bookmark );
}

function process_bookmark(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            var newItem = document.createElement("div");
            
            // create a link
            var newLink = document.createElement("a");
            newLink.href = bookmark.url;
            newLink.append(bookmark.title);

            // create checkbox input to select
            var newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            newCheckbox.setAttribute("data-remove", bookmark.id);
            newCheckbox.addEventListener("change", function (e) {
                let itemId = this.getAttribute("data-remove");
                if (this.checked) {
                    checkedItems.push(itemId);
                } else {
                    let index = checkedItems.indexOf(itemId);
                    if (index > -1) {
                        checkedItems.splice(index, 1);
                    }
                }
            });

            newItem.classList.add("item-bookmark");
            newItem.setAttribute("id", "item-bookmark-" + bookmark.id);
            newItem.append(newCheckbox);
            newItem.append(newLink);
            listBookmarks.append(newItem);

            var newArr = [];
            newArr['id'] = bookmark.id;
            newArr['val'] = bookmark.title;
            arrVal.push(newArr);
        }

        if (i == (bookmarks.length - 1)) {
            listBookmarks.classList.add('loaded-full-bookmarks');
        }

        if (bookmark.children) {
            process_bookmark(bookmark.children);
        }
    }
}
