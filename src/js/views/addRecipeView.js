import View from "./View.js";
import icons from 'url:../../img/icons.svg';

/**
 * addRecipeView.js will handle the recipe upload window and event listeners
 * related to that window. Sends data from add recipe form to it's handler (upload recipes in model)
 */

class addRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message = 'Recipe was successfully uploaded and added to bookmarks!';

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
        
    }
    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerCloseWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArr = [...new FormData(this)]; 
            const data = Object.fromEntries(dataArr);
            handler(data);
            
        })
    }

    _generateMarkup(){
        
    }
}
export default new addRecipeView();