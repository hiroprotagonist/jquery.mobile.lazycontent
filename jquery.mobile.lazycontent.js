/**
 * @author stefan.gebhardt@abas.de
 */
(function($, undefined) {
	$.widget("mobile.lazycontent", $.mobile.widget,{
		options: {
			contenturl: 'moin' // jqm evaluates data-url. So i call the parameter contenturl.
		},
		_init: function() {
			var self = this
			  , page = this.element.parents( ':jqmData(role="page")' );
			// Re-load content everytime the page is displayed
			page.bind( 'pageshow', $.proxy( this._loadcontent, this ) );

			// Install custom event to trigger load
			this.element.bind( 'loadcontent', $.proxy( this._loadcontent, this ) );
		},
		_loadcontent: function (event) {
			var widget = this
			  , url = widget.element.attr('data-contenturl'); // The URL can change dynamically. Easy to retrieve the property every time.
			$.ajax ({
				url: url,
				success: function( html ) {
					var content = $( html.trim() );
					widget.element.html( content );	// Replace old content with new content
					if ( typeof(content.attr('data-role')) !== 'undefined' ) {	// Apply ui plugin if possible
						var pluginName = content.attr('data-role');
						content[pluginName]();
					}					
				},
				beforeSend: $.proxy(widget._displayLoadingState, this) // Display something while loading the content
			});
		},
		_displayLoadingState: function () {
			var loading = $('<span>').addClass('lazycontent-loading');
			this.element.html ( loading );
		}
	});
	$.mobile.document.bind( "pageinit", function( e ) {
		$( ":jqmData(role='lazycontent')", this ).each(function() {
			$(this).lazycontent();
		});
	});
})( jQuery );
