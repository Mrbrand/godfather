/* KNAPPAR   *******************************************************************/

$(".add-button").click(function() {
   itemList.add_from_form(current_page+" form");
	awesomplete.list = itemList.get_quicklist();
   open_page(previous_page);
});


$(".back-button").click(function() { 
	 open_page(previous_page);
});

$(".up-button").click(function() { 	 
	if(current_item.parent_id){	
		current_item = itemList.get_item(current_item.parent_id);
		open_page("#single_issue");
	}
});


$(".cancel-button").click(function() { 
    open_page(previous_page);
}); 


$('#task_list input[type=search]').on('search', function () {
     open_page("#task_list");
});

$("#category_filter").change(function() { 
	if($(this).val()=="edit") open_page("#category_list");
	else open_page("#task_list");
}); 

$("#type_filter").change(function() { 
	 open_page("#task_list");
}); 
 
 
$("#search").focus(function() { 
    $("#extra-controls").show();
}); 
 
$(".delete-button").click(function() {
	id = $(current_page+" form .item-id").val();
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
		itemList.remove_item(id);
		awesomplete.list = itemList.get_quicklist();
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
        
        if(item.repeat){
            var item_copy = itemList.copy(item.id);
            item_copy["postpone"] = moment().add( item.repeat, 'days').format('YYYY-MM-DD');   
            //itemList.add_item(item_copy);   
        }
        
	    itemList.set_item_field(item.id, "finish_date", moment().format('YYYY-MM-DD HH:mm:ss'))
	            
        open_page(previous_page);
        //$("body").scrollTop(scroll_position);
        
 });
 
 
$("#import-button").click(function() { 
    var items = JSON.parse($('#import').val());
    if (confirm('Add '+items.length+' items?')==true) {
       	itemList.import_json($('#import').val());     
       	open_page("#task_list");
    }
});


$("#prio-decrease-button").click(function() { 
    if (confirm('Decrease prio one step?')==true){
 			prio_decrease();
			alert("Prio was decreased!");
    }
});
 
 

$(".more-button").click(function() {	
	$('.more').show();
	$('.more-button').hide();
});
 
 

// NEW TASK BUTTON ITEM_VIEW
$("#single_issue .new-task-button").click(function() { 
	view_new({title:"", type:"6", parent_id: current_item.id,  icon:"", prio:"1", category: current_item.category, postpone: ""});
});

// NEW PROJECT BUTTON ITEM_VIEW
$("#single_issue .new-project-button").click(function() { 
	view_new( {title:"", type:"7", parent_id: current_item.id,  icon:"", prio:"1", category: current_item.category, postpone: ""});
});

// NEW TASK BUTTON TASK_LIST (filter view)
$("#task_list .new-task-button").click(function() { 
	var category = $("#category_filter").val(); if (category =="*") category = "-";
	view_new({title:"", type:"6", parent_id:"", icon:"", prio:"1", category: category, postpone:""});	
});

// NEW PROJECT BUTTON TASK_LIST (filter view)
$("#task_list .new-project-button").click(function() { 
	var category = $("#category_filter").val(); if (category =="*") category = "-";	
	view_new({title:"", type:"7", parent_id:"", icon:"", prio:"1", category: category, postpone:""});
});

// NEW CHILD 
$(document).on('click', ".subitem-right", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);
	view_new( {title:"", type:"6", parent_id: item.id,  icon:"", prio:"1", category: item.category, postpone: ""});
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
	awesomplete.list = itemList.get_quicklist();
   open_page(previous_page);
});

/*$("#show_postponed").change(function() { 
    open_page("#issues");
}); 
*/


// swipe back
$("#single_issue").on('swiperight',  function(){ 
		if(current_item.parent_id){	
		current_item = itemList.get_item(current_item.parent_id);
		open_page("#single_issue");
	}
});


// swipe back
$("#single_issue").on('swipeleft',  function(){ 
		open_page("#task_list");
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

// EDIT-BUTTON 
$("#edit-button").click(function() { 
	$("#edit .menu-title").html("Edit: "+current_item.title);
    fill_form("#edit-item-form", current_item);
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
$(document).on('click', "#task_list .subitem-center, #single_issue .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(id);

	open_page("#single_issue");
	//view_single_issue(id);
});


/*// GOTO SINGLE ISSUE PARENT
$(document).on('click', "#task_list .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();	

	if (itemList.get_item(id).parent_id) {//om item har parent
		current_item = itemList.get_item(itemList.get_item(id).parent_id);
		open_page("#single_issue");
	}

	//view_single_issue(id);
});
*/

window.addEventListener("awesomplete-selectcomplete", function(e){
	str = $("#parent").val()
	pos = str.indexOf("#");
	id = parseInt(str.substr(pos+1));
	$('#edit-item-form input[name="parent_id"]').val(id); 
	//$(".item-parent-id").val(id);
}, false);


