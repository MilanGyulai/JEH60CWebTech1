$(document).ready(function() {
    $("#K1").click(function() {
      $("#list1 li:first, #list1 li:nth-child(2)"),.hide();
      $("#list1 li:first a").attr("href", "https://new-link1.com");
      $("#list1 li:nth-child(2) a").attr("href", "https://new-link2.com");
    });
  
  });
  