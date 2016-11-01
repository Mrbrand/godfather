/* KNAPPAR   *******************************************************************/

$(".add-button").click(function() {
    itemList.add_from_form(current_page+" form");
     open_page(previous_page);
});


$(".back-button").click(function() { 
	 open_page(previous_page);
});

$(".cancel-button").click(function() { 
    open_page(previous_page);
}); 

// x:et i sökrutan
$('input[type=search]').on('search', function () {
     open_page("#issues");
});

$("#category_filter").change(function() { 
    if($(this).val()=="edit") open_page("#category_list");
    else open_page("#issues");
}); 
 
 
$("#issues .search").focus(function() { 
    $("#controls-tags").show();
}); 
 
 $("#issues .search").blur(function() { 
    $("#controls-tags").fadeOut(200);
}); 
 
$(document).on('click', ".tag-button", function() {
    console.log("hej");
    var tag = $(this).html();
    $("#issues .search").val(tag.substring(0,tag.indexOf(" (")));
    open_page("#issues");
}); 
 
$(".delete-button").click(function() {
	id = $(current_page+" form .item-id").val();
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
		itemList.remove_item(id);
		open_page(previous_page);
    }
});


$("#export-button").click(function() { 
    
   	var field1 = $("#field1").val().toLowerCase();
    var op1 = $("#op1").val();
    var value1 = $("#value1").val();
    var field2 = $("#field2").val().toLowerCase();
    var op2 = $("#op2").val();
    var value2 = $("#value2").val();
    var items=itemList.get_all();
    
    var items=itemList.get_all();
    if(field1!="") items = items.query(field1, op1, value1);
    if(field2!="") items = items.query(field2, op2, value2);
 
    var items_string = JSON.stringify(items);
    $("#export").html(items_string);
    $(".page").hide();
    $("#export").show();
});


$(".finish-button").click(function() {
        item = itemList.get_item($("#edit-item-form .item-id").val());
        itemList.edit_from_form("#edit-item-form");
        
        /*if(item.repeat){
            var item_copy = itemList.copy_item(item.id);
            item_copy["postpone"] = moment().add( item.repeat, 'days').format('YYYY-MM-DD');      
        }
        */
        
	    itemList.set_item_field(item.id, "finish_date", moment().format('YYYY-MM-DD HH:mm:ss'))
	            
        open_page(previous_page);
        //$("body").scrollTop(scroll_position);
        
 });
 
 
$("#import-button").click(function() { 
    var items = JSON.parse($('#import').val());
    if (confirm('Add '+items.length+' items?')==true) {
        //window.localStorage.setItem(itemList.storageKey, $('#import').val());
       	console.log(JSON.parse($('#import').val()));
       	/*
       	console.log(JSON.parse('[{"title":"Engagemang","type":"13","prio":"6","postpone":"","notes":"","id":"4","parent_id":"0","order":3,"repeat":"","icon":"📢","start_date":"2016-03-12 15:24:37","update_date":"2016-03-12 15:25:59","finish_date":"","path":"//","subitems":[{"title":"Sjöbis fixarlista","type":"7","postpone":"2016-09-13 Tue","prio":"2","icon":""}],"category":"-"},{"title":"Personligt","type":"13","prio":"6","postpone":"","notes":"","id":"3","parent_id":"0","order":2,"repeat":"","icon":"🙋","start_date":"2016-03-12 15:24:12","update_date":"2016-04-03 18:40:09","finish_date":"","path":"//","subitems":[],"category":"-"},{"title":"Solvik","type":"13","prio":"6","postpone":"","notes":"","id":"1","parent_id":"0","order":1,"repeat":"","icon":"🌄","start_date":"2016-03-12 13:40:23","update_date":"2016-04-06 12:48:08","finish_date":"","path":"//","subitems":[{"title":"Adrian","type":"7","postpone":"","prio":"5","icon":""}],"category":"-"},{"title":"Hemmet","type":"13","icon":"🏡","prio":"6","postpone":"","notes":"","id":"2","parent_id":"0","order":0,"repeat":"","start_date":"2016-03-12 13:40:26","update_date":"2016-05-06 11:06:44","finish_date":"","path":"//","subitems":[],"category":"-"}]'));
       	*/
       	itemList.import_json($('#import').val());     
       	console.log(itemList.itemArray);  	
       	open_page("#issues");
    }
});
 

$(".more-button").click(function() {	
	$('.more').show();
	$('.more-button').hide();
});
 
 
 
$(".new-issue-button").click(function() {
	$("#new-item-form").children().show();
	$("#new-item-form .context").hide();
	$("#new .menu-title").html("New Project");
	
	
	fill_form("#new-item-form", {title:"", type:"7",  icon:"", prio:"6", parent_id:"-"});	
	
	$('#new-item-form select[name="category"]').val($("#category_filter").val()); 
	if($("#category_filter").val() =="*") $('#new-item-form select[name="category"]').val("-"); 
	
	open_page ("#new");
});


$("#single_issue .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new-item-form .category_select").hide();
	$("#new .menu-title").html("New Task for: "+current_item.title);
	
	fill_form("#new-item-form", {title:"", type:"6", parent_id: current_item.id,  icon:"", prio:"6", category: current_item.category});		
	
	open_page ("#new");
	
});

$("#task_list .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new .menu-title").html("New Task: No project");
	
 	fill_form("#new-item-form", {title:"", type:"6", parent_id:"-", icon:"", prio:"6", category:"-"});		
	open_page ("#new");
	
});



$(".new-category-button").click(function() { 
    fill_form("#new-category-form", {title:"", type:"13", icon:""});	
	open_page ("#new-category");
	
});


$(".pref-button").click(function() { 
	open_page("#menu");
});

$("#task_list input[name='icon']").click(function() { 
	open_page("#task_list");
});


$(".save-button").click(function() {
    itemList.edit_from_form(current_page+" form");
     open_page(previous_page);
});

/*$("#show_postponed").change(function() { 
    open_page("#issues");
}); 
*/


// swipe back
$("#single_issue").on('swiperight',  function(){ 
	open_page("#issues");
});

// swipe back settings
$("#export").on('swiperight',  function(){ 
	open_page("#menu");
});


$(".task-list-button").click(function() { 
	open_page("#task_list");
});


$(".issue-list-button").click(function() { 
	open_page("#issues");
});



// GOTO EDIT  
$(document).on('click', ".task .subitem-left, .issue .subitem-left", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);
	
	$("#edit .menu-title").html("Edit: "+item.title);
    fill_form("#edit-item-form", item);
    open_page ("#edit");
});


// GOTO CATEGORY EDIT  
$(document).on('click', ".category .subitem-left", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);

	$("#edit-category .menu-title").html("Edit: "+item.title);
    fill_form("#edit-category-form", item);
    open_page ("#edit-category");
});

// GOTO SINGLE ISSUE
$(document).on('click', ".issue .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(id);

	$("#single_issue .menu-title").text(current_item.title);

	open_page("#single_issue");
	//view_single_issue(id);
});


// GOTO SINGLE ISSUE
$(document).on('click', "#task_list .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(itemList.get_item(id).parent_id);

	$("#single_issue .menu-title").text(current_item.title);
	
	open_page("#single_issue");
	//view_single_issue(id);
});


