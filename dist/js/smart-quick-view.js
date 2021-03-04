/**
 * jQuery Smart Quick View Plugin
 * Requires jQuery v1.7 or later
 *
 * @author emranio <hello@emran.io>
 * @license GPL 3.0 or later
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Thanks to Ashraf for some excellent CSS contributions!
 */

( function( $ ) {
	'use strict';

	$.smartQuickView = function( element, options ) {
		// to avoid confusions, use "plugin" to reference the
		// current instance of the object.
		let _self = this;

		// This is the easiest way to have default options.
		_self.settings = $.extend( {
			eventContainer: $( document ),
			modalContainer: $( 'body' ),
			remoteContainer: '#sqv-remote-container',
			modalClass: '',
			sourceURL: '',
			payload: {},
			method: 'POST',
			showLoadingSpinInModal: false,
			closeModalByClickOnBody: true,
			onClickBodyClass: '', // .sqv-element-clicked class will always be added.
			onModalOpenBodyClass: '', // .sqv-modal-opened class will always be added.
			onClickCallback: function() {},
			onCompleteCallback: function() {},
		}, options );

		// reference to the actual DOM element.
		_self.element = element;

		// created dom property for modal.
		// todo: need to optimization.
		_self.modalCache = null;

		// modal dom property.
		_self.modal = $( '<div>', {
			class: 'sqv-modal sqv-modal--wrapper ' + _self.settings.modalClass,
		} );
		_self.elementLoadingSpin = $( '<span>', {
			class: 'sqv-element-loading-spin',
		} );

		// concat the must needed classes.
		_self.settings.onClickBodyClass += ' sqv-element-clicked';
		_self.settings.onModalOpenBodyClass += ' sqv-modal-opened';

		// enabling the end user to pass simple selector name or jQuery dom object.
		_self.settings.eventContainer = ( typeof _self.settings.eventContainer === 'string'
			? $( _self.settings.eventContainer )
			: _self.settings.eventContainer );

		_self.settings.modalContainer = ( typeof _self.settings.modalContainer === 'string'
			? $( _self.settings.modalContainer )
			: _self.settings.modalContainer );

		// initialize the lib.
		_self.init = function() {
			// nothing is going on at this moment.
		};

		// later, i will add more code comments to the following lines.
		_self.clickEvent = function( e ) {
			e.preventDefault();

			let clickedElement = $( this );
			if ( clickedElement.data( 'sqv-status' ) === 'locked' ) {
				return;
			}

			_self.settings.sourceURL = ( typeof clickedElement.data( 'source-url' ) === 'undefined'
				? _self.settings.sourceURL
				: clickedElement.data( 'source-url' ) );

			_self.settings.payload = ( typeof clickedElement.data( 'payload' ) === 'undefined'
				? _self.settings.payload
				: clickedElement.data( 'payload' ) );

			_self.modalCache = ( _self.modalCache === null ? _self.modalCreate() : _self.modalCache );

			_self.loadingWarper = ( _self.settings.showLoadingSpinInModal === false
				? clickedElement
				: _self.modalCache.find( '.sqv-modal--overlay' ) );

			$.ajax( {
				method: _self.settings.method,
				url: _self.settings.sourceURL,
				data: _self.settings.payload,

				beforeSend: function( ) {
					clickedElement.data( 'sqv-status', 'locked' );
					$( 'body' ).addClass( _self.settings.onClickBodyClass );
					_self.loading( 'show' );
					_self.settings.onClickCallback();
				},

				success: function( response ) {
					clickedElement.data( 'sqv-status', 'no' );
					_self.modalOpen().html( _self.extractContent( response ) );
					_self.loading( 'hide' );
					$( 'body' ).addClass( _self.settings.onModalOpenBodyClass );
				},
				complete: function() {
					$( 'body' ).removeClass( _self.settings.onClickBodyClass );
					_self.settings.onCompleteCallback();
				},
			} );
		};

		_self.extractContent = function( html ) {
			let domElement = $( html ).find( _self.settings.remoteContainer );
			return ( domElement.length > 0 ? domElement.html() : 'No content found' );
		};

		_self.loading = function( action ) {
			_self.elementLoadingSpin.appendTo( _self.loadingWarper );
			_self.loadingWarper.toggleClass( 'sqv-loading-spin-show sqv-loading-action-' + action );
		};

		_self.modalCreate = function() {
			return _self.modal.appendTo( _self.settings.modalContainer )
				.html( `
                <div class="sqv-modal--overlay"><!-- it's an empty div, used for modal overlay and modal loading spin --></div>
                <div class="sqv-modal__body"> 
                    <div class="sqv-modal__body--close-btn"> 
                        <i class="sqv-close-icon"></i>
                    </div>
                    <div class="sqv-modal__body--content">
                        <!-- remote content goes here -->
                    </div>
                </div>
            ` ); // easiest way to inject html for better readablity.
		};

		_self.modalOpen = function() {
			$( 'body' ).addClass( _self.settings.onCompleteBodyClass );

			return _self.modal.find( '.sqv-modal__body--content' );
		};

		_self.modalCloseEvent = function( e ) {
			e.preventDefault();

			$( 'body' ).removeClass( _self.settings.onModalOpenBodyClass );
		};

		_self.init();
		$( _self.settings.eventContainer ).on( 'click', _self.element, _self.clickEvent );
		$( _self.settings.eventContainer ).on( 'click', '.sqv-modal__body--close-btn', _self.modalCloseEvent );

		return this;
	};
}( jQuery ) );
