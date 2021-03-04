# smart-quick-view
A simple jQuery plugin to grab a remote page's content and show in a popup modal.


 * jQuery Smart Quick View Plugin
 * Requires jQuery v1.7 or later
 *
 * @author emranio <hello@emran.io>
 * @license GPL 3.0 or later
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Thanks to Ashraf for some excellent CSS contributions!

 Usage:
 jQuery( document ).ready( function( $ ) {
    // begins
	$.smartQuickView( '.shopengine-quickview-trigger', {
		remoteContainer: '.shopengine-quickview-content-warper',
		showLoadingSpinInModal: true,
		payload: {
			shopengine_quickview: 'modal-content',
		},
		onCompleteCallback: function() {
			$( '.woocommerce-product-gallery' ).wc_product_gallery();
		},
	});
    // ends
});

	