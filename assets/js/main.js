---
main_color: amber-600
---
function init($){
  function initNavMenu(){
    var toggleOpen = $("#toggleOpen");
    var toggleClose = $("#toggleClose");
    var collapseMenu = $("#collapseMenu");

    function handleClick(e) {
      collapseMenu.toggleClass("hidden");
      toggleClose.toggleClass("hidden");
    }

    toggleOpen.click(handleClick);
    toggleClose.click(handleClick);
  }

  function initSideMenu(){
    var currentPageId = $("#main-content").data("page-id");

    if (currentPageId != ""){
      var currentSidebarLink = $(`#sidebar [data-page-id="${currentPageId}_link"]`);
      var pageMainColor = $("#main-content").data("page-main-color");
      
      if (currentSidebarLink.length == 1){
        currentSidebarLink.parents("ul").siblings(".sidebar-group-option").prop("checked", true);
        currentSidebarLink.removeClass("text-gray-600").removeClass("dark:text-gray-300").addClass(pageMainColor ? "font-bold text-"+pageMainColor : false || "active");
      }
    }

    $("#sidebar .mobile-toggle").click(function(){
      $(".sidebar-content").toggleClass("hidden");
    });
  }

  initNavMenu();
  initSideMenu();
  window.DF_Wiki.init = true;
}

function devAppendPageLog(heading, content, type = "info"){
  if (!$(".dev-page-logs").length) return;

  var defaultColor = "text-slate-400";

  switch (type){
    case "warning": {
      defaultColor = "text-yellow-400";
      break;
    }
    case "error": {
      defaultColor = "text-red-400";
      break;
    }
    case "success":{
      defaultColor = "text-green-400";
      break;
    }
  }

  $(".dev-page-logs").append(`
    <div class="mt-4 flex">
      <span class="${defaultColor}">${heading}:~$</span>
      <p class="flex-1 typing items-center pl-2">
        ${content}
      </p>
    </div>
  `);
}

function generateFileDownload(filename, text) {
  var blob = new Blob([text], { type: "text/plain" });
  var url = window.URL.createObjectURL(blob);
  var $a = $("<a>")
      .attr("href", url)
      .attr("download", filename)
      .appendTo("body");
      
  $a[0].click();

  $a.remove();
  window.URL.revokeObjectURL(url);
}

function getBaseUrl(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const pathSegments = pathname.split('/');
  
  // Ignore the first empty segment
  const basePathSegments = pathSegments.slice(1, -1);
  
  if (basePathSegments.length === 0) {
      return urlObj.href;
  }
  
  // Join segments and add trailing slash
  const baseUri = `/${basePathSegments.join('/')}/`;
  
  return baseUri;
}

function getFileContents(url, callback, dataType = "json", asyncreq = true) {
  return $.ajax({
    url: url,
    dataType: dataType,
    success: function(response) {
      if(callback) callback(response);
    },
    error: function(xhr, status, err) {
      console.error('Error fetching file:', err.message);
    },
    async: asyncreq
  });
}

async function fetchGithubFolder(user, repo, folderPath, branch = "main", progress = null) {
  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folderPath}?ref=${branch}`;
  const files = {};

  try {
    const response = await fetch(apiUrl, {
      cache: "no-cache"
    });
    if (!response.ok) {
      console.log(`Failed to fetch: ${response.statusText}`);
      return null;
    }

    const items = await response.json();
    
    var i = 1;
    for (const item of items) {
      if (progress){
        progress(i, items.length, "Downloading data from Github");
      }
      if (item.type === "file") {
        const fileResp = await fetch(item.download_url);
        const content = await fileResp.text();

        files[item.name] = content;
      } else if (item.type === "dir") {
        // Optional: recursively fetch subfolders
        // const subFiles = await fetchGithubFolder(user, repo, `${folderPath}/${item.name}`, branch);
        // Merge subFiles into files object if needed
      }
      
      i++;
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  return files;
}

function saveEnemyIds(data){
  if (!data){
    console.log("Could not get Enemy Ids");
    return;
  }

  try{
    window.DF_Wiki.enemyIds = data;
  }
  catch(e){
    console.log("Could not parse Enemy Ids");
    console.log(e);
    return;
  }
}

function genBadge(bgColor, textColor, text){
  return `<span class="rounded-full bg-${bgColor} text-${textColor} px-2.5 py-0.5 text-sm whitespace-nowrap">${text}</span>`;
}

function genQuestCategoriesBadge(q){
  var ret = "";
  
  if (q.category){
    for (var c in q.category){
      ret += genBadge("neutral-700", "white", q.category[c]);
    }
  }

  return ret;
}

function genItemCategoriesBadge(i){
  var ret = "";

  i.type ? ret += genBadge("neutral-700", "white", i.type) : null;
  i.subtype ? ret += genBadge("neutral-700", "white", i.subtype) : null;
  i.equip_slot ? ret += genBadge("neutral-700", "white", "Equip to: " + i.equip_slot) : null;

  return genQuestCategoriesBadge(i) + ret;
}

function genQuestOrderConditions(q, showHeading = true){
  if (!q.order_conditions) return "";
  
  var heading = `<li class="font-bold underline list-none">Requirements to Accept Quest</li>`;
  var ret = `
    <ul class="flex flex-col gap-3 list-disc">
      ${showHeading ? heading : ""}
  `;

  if (!q.order_conditions.length) ret += `<li class="mx-5">None</li>`;
  
  for (var c in q.order_conditions){
    cond = q.order_conditions[c];
    var reqText = "";

    switch (cond.type){
      case "MinimumLevel": {
        reqText = `You must be at Level ${cond.param01} or higher`;
        break;
      }
      case "AreaRank": {
        reqText = `You must be at Area Rank ${cond.param02} or higher in <b>${cond.param01}</b>`;
        break;
      }
      case "MinimumVocationLevel": {
        reqText = `You must be at Level ${cond.param02} or higher in <b>${cond.param01}</b> Vocation`;
        break;
      }
      case "MainQuestCompleted": {
        reqText = `You must complete the Main Quest: <b>${resolveQuestLinkFromId(cond.param01)}</b>`;
        break;
      }
      default: continue
    }

    ret += `
        <li class="mx-5">${reqText}</li>
    `;
  }

  ret += `</ul>`;

  return ret;
}

function loadableLoaderProgressReport(done, total, message){
  $(".loadable-loader .text").text(`Loading [${done} / ${total}] (${message})`);
}

function checkSearchSubmit(id, handler){
  var currentSearchWord = new URL(location.href).searchParams.get("s");
  if (currentSearchWord) {
    $(id).val(currentSearchWord);
    handler(null);
  }
}

function setSearchSubmitValue(val){
  history.replaceState(null, $("title").text(), location.origin + location.pathname + "?s=" + val);
}

function stringOverride(format, value){
  value = String(value);

  if (value.length >= format.length) return value;

  return format.slice(0, format.length - value.length) + value;
}

function resolveQuestLinkFromId(questId){
  if (!DF_Wiki.rootQuestsIdIndex) return questId;

  questId = questId.toString();

  if (questId.indexOf("q") == -1) questId = stringOverride(DF_Wiki.questIdFormat, questId);

  //var rootPath = DF_Wiki.rootPath == '/' ?  : DF_Wiki.rootPath + '/game_content/quests/view?id=';

  return `{% include link-highlight.md href="__HREF__" text="__TEXT__" %}`.replace("__HREF__", 'game_content/quests/view?id=' + questId)
    .replace("__TEXT__", DF_Wiki.rootQuestsIdIndex[questId]);
}

function getAndSaveEnemyIds(){
  getFileContents("{{ '/game_content/assets/monsterIds.json' | relative_url }}", saveEnemyIds);
}

/**
 * The function `checkDataJson` is used to retrieve and set JSON data from a file or a provided JSON
 * object.
 * @param [json=null] - The `json` parameter is used to pass a JSON object to the `checkDataJson`
 * function. If a JSON object is provided, it will be assigned to `DF_Wiki.dataJson` and the function
 * will return. If no JSON object is provided, the function will attempt to fetch the
 * @param [asyncreq=true] - The `asyncreq` parameter in the `checkDataJson` function is a boolean flag
 * that determines whether the file retrieval operation should be asynchronous (`true`) or synchronous
 * (`false`). If `asyncreq` is set to `true`, the file retrieval operation will be asynchronous,
 * allowing
 * @param [jsonFileName=index_data.json] - The `jsonFileName` parameter is a string that represents the
 * name of the JSON file to be fetched. In this case, the default value is set to "index_data.json".
 * @returns If the `json` parameter is provided and not null, the function will set the
 * `DF_Wiki.dataJson` to the provided `json` and return nothing. If the `json` parameter is not
 * provided or is null, the function will attempt to fetch the contents of the `index_data.json` file
 * using the `getFileContents` function and return nothing.
 */
function checkDataJson(json = null, asyncreq = true, jsonFileName = "index_data.json"){
  if (json) {
    DF_Wiki.dataJson = json;
    return;
  }

  getFileContents(getBaseUrl(location.href) + jsonFileName, checkDataJson, "json", asyncreq);
}

// Expects __MAIN_HEADING__ , __HEADING__ and __CONTENT__ placeholders
/**
 * The function `insertCSVToHtml` reads CSV data, processes it, and inserts it into an HTML element
 * based on specified parameters.
 * @param csv_filename - The `csv_filename` parameter is the name of the CSV file that contains the
 * data you want to insert into the HTML.
 * @param mainHeadingColumnIndex - The `mainHeadingColumnIndex` parameter is the index of the column in
 * your CSV file that contains the main heading or title for each item in the data. This index is used
 * to extract the main heading value for each item and insert it into the HTML output.
 * @param insertAtSelector - The `insertAtSelector` parameter is a CSS selector that specifies where
 * the generated HTML content should be inserted into the DOM. It could be a class selector (e.g.,
 * `.my-container`), an ID selector (e.g., `#main-content`), or any other valid CSS selector that
 * @param startHtml - The `startHtml` parameter is a string that represents the HTML structure for the
 * beginning of each section in the output HTML. It typically contains a placeholder `__MAIN_HEADING__`
 * that will be replaced with the main heading content from the CSV data.
 * @param itemHtml - The `itemHtml` parameter in the `insertCSVToHtml` function is a string that
 * represents the HTML template for each item in the CSV data. It should contain placeholders
 * `__HEADING__` and `__CONTENT__` which will be replaced with the corresponding header and data values
 * from the
 * @param endHtml - The `endHtml` parameter in the `insertCSVToHtml` function is used to specify the
 * HTML content that should be inserted at the end of each item in the CSV data when generating the
 * final HTML output. This can be any valid HTML content that you want to add after each item in the
 * @param [loadedCsv] - The `loadedCsv` parameter in the `insertCSVToHtml` function is used to store
 * the CSV data that has been loaded and parsed into an array. It is initially set to -1 and is later
 * updated with the parsed CSV data when it is successfully loaded. This parameter helps in checking if
 * @returns The function `insertCSVToHtml` is returning the processed CSV data in HTML format and
 * inserting it into the specified selector element on the webpage.
 */
function insertCSVToHtml(csv_filename, mainHeadingColumnIndex, insertAtSelector, startHtml, itemHtml, endHtml, loadedCsv = -1){
  if (!DF_Wiki.dataJson) {
    setTimeout(insertCSVToHtml, 200, csv_filename, mainHeadingColumnIndex, insertAtSelector, startHtml, itemHtml, endHtml);
    return;
  }

  if (!DF_Wiki.dataJson[csv_filename]) return;

  if (loadedCsv == -1) {
    getFileContents(getBaseUrl(location.href) + csv_filename, (csv) => {
      insertCSVToHtml(csv_filename, mainHeadingColumnIndex, insertAtSelector, startHtml, itemHtml, endHtml, csv.split('\n'));
    }, "text");

    return;
  }

  if (!loadedCsv) return;

  var headers = loadedCsv[0].split(",");

  if (!headers) return;

  var outputHtml = "";

  for (line in loadedCsv){
    if (line != 0){
      var data = loadedCsv[line].split(",");

      if (data.length != headers.length) {
        console.log(`Skipping\nData (${data.length}): ${data}\nHeaders (${headers.length}): ${headers}`);
        continue;
      } 
      outputHtml += startHtml.replace("__MAIN_HEADING__", data[mainHeadingColumnIndex]);
      
      for (cell in data){
        outputHtml += itemHtml.replace("__HEADING__", headers[cell]).replace("__CONTENT__", data[cell]);
      }

      outputHtml += endHtml;
    }
  }
  
  $(insertAtSelector).html(outputHtml);
}

$(function(){
  window.DF_Wiki = {
    csvHtmlStart: `
      {% include card-section-start.md %}
        {% include card-section-header.md heading="__MAIN_HEADING__" %}
        <div class="space-y-4">
    `,
    csvHtmlItem: `
          <div>
            {% include card-section-sub-header.md heading="__HEADING__" %}
            <p>__CONTENT__</p>
          </div>
    `,
    csvHtmlEnd: `
        </div>
      {% include card-section-end.md %}
    `,
    linkHighlightTemplate: `{% include link-highlight.md href="__HREF__" text="__TEXT__" %}`,
    linkHighlightExtTemplate: `{% include link-highlight-ext.md href="__HREF__" text="__TEXT__" %}`,
    rootPath: `{{ "/" | relative_url }}`,
    questIdFormat: "q00000000",
    itemIconIdFormat: "ii000000",
    itemIdFormat: "i00000000"
  };

  init($);
});