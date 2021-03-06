/* INIT *******************************************************************/
var itemList = new Carbon("wiseguy_items");

var current_page = "#issues";
var previous_page = "";
var scroll_positions = [];
var current_item={};
var debug = new Timer();
var tags = [];

var items = itemList.get_all();


items.forEach(function(item) {
	if(item.category == undefined) item.category = "-";
	if(item.parent_id == "-") item.parent_id = "";
 	if(moment(item.postpone, 'YYYY-MM-DD') < moment()) item.postpone =""; 
});

// Manuell sortering 
Sortable.create(document.getElementById('open'), {handle: '.subitem-right',onSort: function (evt) {
    var tasks  = itemList.get_all().query("finish_date","==","").query("parent_id", "==", current_item.id);
    reorder(tasks, evt.oldIndex, evt.newIndex);
}});

Sortable.create(document.getElementById('categories'), {handle: '.subitem-right',onSort: function (evt) {
    var categories=itemList.get_all().query("type", "==", 13);
    reorder(categories, evt.oldIndex, evt.newIndex);
}});

set_categories();
open_page("#task_list");

//awesomlete
var input_parent = document.getElementById("parent");
var awesomplete = new Awesomplete(input_parent);
awesomplete.list = itemList.get_quicklist();


/* PageHandler class *******************************************************/

function open_page (page_id, show_extra) {
	scroll_positions[current_page] = $("body").scrollTop();
	previous_page = current_page;
	current_page = page_id;
	
	//console.log(scroll_positions);
	
	if(page_id == "#category_list") view_category_list();
	else if(page_id == "#issues") view_issue_list();
	else if(page_id == "#single_issue") view_single_issue(current_item.id);
	else if(page_id == "#task_list") view_task_list();
	else if(page_id == "#menu") view_settings(); 
	
	console.log(page_id);
	
	$(".page").hide();
	$(page_id).show();

	if(page_id == "#task_list" || page_id == "#issues" )  $("body").scrollTop(scroll_positions[page_id]);
	else window.scrollTo(0, 0);
	
	
}


/* FUNCTIONS *******************************************************************/



function view_task_list(){ 	
   var query = $(".search_task").val().toLowerCase();
   var icon = $('input[name="icon"]:checked').val();
	var category = $("#category_filter").val();
	//var sortby = $("#sortby").val();

   var open_items=itemList.get_all();
	var open_items_with_meta = [];
	
	//lägga till metadata så som parent_tree, subitem_count, etc 
	open_items.forEach(function(item) {
		open_items_with_meta.push(item_with_meta(item.id));
	});
	open_items = open_items_with_meta;

//console.log(open_items_meta);
open_items =open_items
		.query("type", "!=", 13) //inte kategorier
		.query("finish_date", "==", "")
		.query("title, notes, parent_tree", "contains", query)

	// filtrera bort lågprioriterade (snabbhet)
  	if (query=="" & category=="*") 	open_items = open_items.query("prio", "<" ,prio_filter); 
	
	// filtrera bort projekt som redan har subtask
	if (query=="") 	open_items = open_items.query("open_task_count", "==", 0);	
	
	// filtrera på kategori om kategori är vald	
	if(category!="*") open_items=open_items.query("category", "==", category);

	// filtrera på ikon om ikon är vald	
   if(icon) open_items=open_items.query("icon", "==", icon);
 	if(query=="" & icon=="") open_items = open_items.query("prio", "<" ,5);
   
	//sortera items
   open_items.sort(
        firstBy("prio")
        .thenBy("postpone") 
        .thenBy("update_date", -1)
	);

	mustache_output("#tasks", open_items, "#filtered_task_template", "prio");

  	//om inga items hittas
	if (open_items.length == 0) $("#open_items").append("<div class='empty'>No items here</div>");
}



function view_single_issue (id) {
	$("#single_issue .menu-title").text(current_item.title);    

	var open_items = itemList.get_all()
    	.query("finish_date","==","")
    	.query("parent_id", "==", id)
    	.sort(firstBy("order")
    	.thenBy("update_date", -1));
    
    var finished_items = itemList.get_all()
    	.query("finish_date","!=","")
    	.query("parent_id", "==", id)
    	.sort(firstBy("finish_date",-1));

	mustache_output("#open", open_items, "#open_task_template");
   mustache_output("#finished", finished_items, "#finished_task_template");
    
    // om listan är tom
   if (open_items.length==0 && finished_items.length == 0) $("#open").append("<div class='empty'>No items</div>");

	current_item = itemList.get_item(id);
}



function view_category_list() {
    var categories=itemList.get_all()
    	.query("type", "==", 13)
		.sort(firstBy("order").thenBy("update_date", -1) );
    
    mustache_output("#categories", categories, "#category_template");
}


function view_settings(){
    
    var field1 = $("#field1").val().toLowerCase();
    var op1 = $("#op1").val();
    var value1 = $("#value1").val();
    var field2 = $("#field2").val().toLowerCase();
    var op2 = $("#op2").val();
    var value2 = $("#value2").val();
    var items=itemList.get_all();
    	
    if(field1!="") items = items.query(field1, op1, value1);
    if(field2!="") items = items.query(field2, op2, value2);
    //console.log(items.length+" items");
    
    $("#export_count").html(items.length+" items<br/>");
    $("#export_count").append(items.query("finish_date", "==", "").length+" unfinished items<br/>");
    $("#export_count").append(items.query("finish_date", "!=", "").length+" finished items");
}




function reorder(items, from_pos, to_pos){
    items.sort(firstBy("order").thenBy("update_date", -1) );
    
    var offset = 0;
    
    for (var index = 0, len = items.length; index < len; index++) {
        item = items[index];
        
        if (from_pos >= to_pos){
            if(index == (to_pos)) offset++;
        }
        else{
            if (index == (to_pos+1)) offset++;
        }
        
        if(index == from_pos) offset--;
        item.order = index + offset;
        if(index == from_pos) item.order = to_pos;
    }
    //console.log(items);
    itemList.save(); 
}




function set_categories(){
   	var categories=itemList.get_all().query("type", "==", 13);
   	categories.sort(firstBy("order").thenBy("update_date", -1) );
   	$(".cat").remove();
    categories.forEach(function(item) {
		item_meta = item_with_meta(item.id);
		var template = $('#category_select_template').html();
		var html = Mustache.to_html(template, item_meta);
		$(".category_select").append(html);
	});    
	$(".category_select").val("*");
}



function mustache_output(output_id, items, template_id, group_by){
    //console.log(items);
	var new_group = "";
    var html="";
 	
    $(output_id).empty();
 	
    items.forEach(function(item) {
		if(group_by){
			if (item[group_by]!= new_group)  {
				
				prio_item_count = items.query(group_by,"==",item[group_by]).length;
				html += "<div style='padding:3px; background:#333;color:#AAA;'>"+prio_item_count+"<img src='img/prio"+item[group_by]+".png'></div>";
		   	}
				new_group=item[group_by]; 
			}
		var template = $(template_id).html();
		//console.log(item);
		html += Mustache.to_html(template, item);
	});
	//if($('#debug').prop("checked")) debug.comment("html sträng klar");
	$(output_id).append(html);
}



function item_with_meta(id){
	var item = JSON.parse(JSON.stringify(itemList.get_item(id)));
	open_tasks = itemList.get_all().query("finish_date","==","").query("parent_id", "==", id);
   finished_tasks = itemList.get_all().query("finish_date","!=","").query("parent_id", "==", id);
    
    // sortera array med items
	open_tasks.sort(firstBy("order").thenBy("update_date", -1) );
	finished_tasks.sort(firstBy("finish_date"));
	item.subitems = open_tasks[0];
	item.open_task_count = open_tasks.length;

	item.finished_task_count = finished_tasks.length;
	
	
	var parent= itemList.get_item(item.parent_id);
 	item.parent_tree ="";
	while(parent){	
		item.parent_tree = "/"+ parent.title + item.parent_tree;
		parent= itemList.get_item(parent.parent_id);
	}
	return item;
}

function fill_form(form_id, item){
	var elements = $(form_id).find(".autovalue");
	
	$(form_id + ' input:radio').prop('checked', false); 
    $(form_id + ' input:radio[value="'+item['icon']+'"]').prop('checked', true); // prio (css trick med bilder)
	$(form_id + ' input:radio[value="'+item['prio']+'"]').prop('checked', true); // prio (css trick med bilder)

	elements.each(function(test, element ) {
  		var name = element.getAttribute("name");
  			$(element).val(item[name]);
	});
}

function catch_tags(str, list){
  while(str.indexOf("#")>=0){
  var start = str.indexOf("#")+1;
  var tag = "";
    str = str.substring(start);
  var end = str.indexOf(" ");
  if (end <=0) {
    tag = str;
    str = "";
  }
  else {
    tag = str.substring(0,end);
    str = str.substring(end);
  } 
  //console.log(list);
    if(list.query("tag","==",tag).length==0)
    list.push({tag:tag, count:1});
  else 
    list.query("tag","==",tag)[0].count++;
    //list.push(tag);
  }
}

