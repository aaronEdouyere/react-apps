
const storageName = 'todoList';

const LocalStorageService = {

    getLocalData: function() {
        return JSON.parse(localStorage.getItem(storageName));
    },

    setLocalData: function(list) {
        localStorage.setItem(storageName, JSON.stringify(list));
    }
}


export default LocalStorageService;