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
$('#issues input[type=search]').on('search', function () {
     open_page("#issues");
});

$('#task_list input[type=search]').on('search', function () {
     open_page("#task_list");
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
    var tag = $(this).html().substring(0,$(this).html().indexOf(" ("));
		$("#issues .search").val('#'+tag);
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
	
	
	fill_form("#new-item-form", {title:"", type:"7",  icon:"", prio:"6", parent_id:"-", postpone: ""});	
	
	$('#new-item-form select[name="category"]').val($("#category_filter").val()); 
	if($("#category_filter").val() =="*") $('#new-item-form select[name="category"]').val("-"); 
	
	open_page ("#new");
	$(current_page + " [name='title'] ").focus();
});


$("#single_issue .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new-item-form .category_select").hide();
	$("#new .menu-title").html("New Task for: "+current_item.title);
	
	fill_form("#new-item-form", {title:"", type:"6", parent_id: current_item.id,  icon:"", prio:"6", category: current_item.category, postpone: ""});		
	
	open_page ("#new");
	$(current_page + " [name='title'] ").focus();
	
});

$("#task_list .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new .menu-title").html("New Task: No project");
	
 	fill_form("#new-item-form", {title:"", type:"6", parent_id:"-", icon:"", prio:"6", category:"-", postpone:""});		
	
	open_page ("#new");
	$(current_page + " [name='title'] ").focus();
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
	
	$("#edit .icons").hide();
	if(item.type=="7") $("#edit .project-icons").show();
	else $("#edit .task-icons").show();
	
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


