const API_URL = "https://www.googleapis.com/youtube/v3/search";
const API_Key = "AIzaSyCQtkgjANk9LnhNV-Qc4BwkxCE37vqQwCY";
let strNextPage = '';
let strPrevPage = '';
let strChannelID = '';
let strSearch = '';

function getDataFromApi(searchTopic, strPageToken, currentChannelID){
  let ajaxArguements = {
    type: "GET",
    dataType: "json",
    url: API_URL,
    data: {
      part: 'snippet',
      key: API_Key,
      q: searchTopic,
      resultsPerPage:  5,
      type: 'video',
      pageToken: strPageToken,
      channelId: currentChannelID
    },
    success: function(dataresult){
      strNextPage = dataresult.nextPageToken;
      strPrevPage = dataresult.prevPageToken;
      displayResult(dataresult);
    },
    error: function(req, status, err){
      displayError(status);
      
    }
  };
 $.ajax(ajaxArguements);
}

function displayError(returnStatus){
   $('.search-topic').attr('hidden', false);
  $('.search-topic').html(`Search results for : 
                        '${strSearch}' returned 
                        0 videos because of ${returnStatus}`); 
}

//The commented code below appends thumbnails of the video emmages
 /*     <a href = "https://www.youtube.com/watch?v=${item.id.videoId}" 
        id = "videoBox ${item.id.videoId}">
          <img src="${item.snippet.thumbnails.medium.url}" class = "videoImg ${item.id.videoId}">
      ${item.id.videoId}</a>
  */
  
function displayResult(searchResultData){ 
  $('.result').empty();
  searchResultData.items.map(function(item, index) {
    $('.result').append(`<div class ="video-info">
      <iframe src = 'https://www.youtube.com/embed/${item.id.videoId}' 
              title = ${item.id.videoId}></iframe>
      <ul>
        <li><strong>Title:</strong> ${item.snippet.title}</li>
        <li><strong>By:</strong> ${item.snippet.channelTitle} 
            <a class ="aMore ${item.snippet.channelId}" 
              href="${item.snippet.channelId}">...more</a>
        </li>
        <li><strong>Published on:</strong> ${item.snippet.publishedAt}</li>
      </ul>
    </div>`);
  });
  $('.search-topic').attr('hidden', false);
  $('.search-topic').html(`Search results for 
                        <em>${strSearch}</em> returned 
                        ${searchResultData.pageInfo.totalResults} videos`);
  showHiddenClass(searchResultData);
  showHiddenClass(searchResultData);
}

function searchFromUserInput(){
$('.main-form').on('submit',function(even){
  event.preventDefault();
  $('.result').empty();
  strSearch = $('.search-text').val();
  clearGlobalVars();
  if (strSearch !== '') {
    getDataFromApi(strSearch, strNextPage);
    $('.search-text').val(''); 
  }
});
}
$(searchFromUserInput);

function moveToNextPage(){
  $('.next-button').on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    if(strChannelID) {
      getDataFromApi(strSearch, strNextPage, strChannelID);
    } else if (strSearch){
      getDataFromApi(strSearch, strNextPage);
    }
  });
}
$(moveToNextPage);

function moveToPreviousPage(){
  $('.prev-button').on('click',function(event){
    event.preventDefault();
    if(strChannelID){
      getDataFromApi(strSearch, strPrevPage, strChannelID);
    } else if (strSearch){
      getDataFromApi(strSearch, strPrevPage);
    }
  });
}
$(moveToPreviousPage);

function clearGlobalVars(){
  strNextPage = '';
  strPrevPage = '';
  strChannelID = '';
}

function moreVideosBy(){
  $('.main-form').on('click','.aMore', function(event){
    event.preventDefault();
    strChannelID = $(this).attr('href');
    getDataFromApi(strSearch, strPrevPage, strChannelID);
  });
}
$(moreVideosBy);

function showHiddenClass(apiDataResult){
  //next button
  if (apiDataResult.nextPageToken){
    $('.next-button').attr('hidden',false);
  } else {
    $('.next-button').attr('hidden',true);
  }
  
  //preveious button
  if (apiDataResult.prevPageToken){
    $('.prev-button').attr('hidden',false);
  } else {
    $('.prev-button').attr('hidden',true);
  }
}

function embedMovie(){
  $('.result').on('click', '.videoImg', function(event){
    event.preventDefault();
    $(this).attr('href', "https://www.youtube.com/watch?v=j7PwA53vVzA");
    //$(this).attr("href", newUrl);
  });
}
$(embedMovie);
