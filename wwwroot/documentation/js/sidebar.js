var sidebar_content="";
for (var i=0; i < contents.length; i+=2) {
    sidebar_content+="<li id='" + contents[i+1] + "'><a href='" + contents[i+1] + ".html'>"+ contents[i] + "</a></li>"
}
var sidebar_list = document.getElementById('sidebar_list');
sidebar_list.innerHTML = sidebar_content;

