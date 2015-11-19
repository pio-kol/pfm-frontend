waitUntilReady = function (elm) {
    browser.wait(function () {
        return elm.isPresent();
    },10000);
    browser.wait(function () {
        return elm.isDisplayed();
    },10000);
};

describe('Categories site tests', function() {

    var HTTP_LOCALHOST_8889 = 'http://localhost:8889/#/categories';

    xit('Should present empty categories page with sort capabilities', function() {
        //given
        var categoryNameHeader = element(by.id('categoryNameHeader'));
        var parentCategoryHeader = element(by.id('parentCategoryHeader'));

        var categoryName = 'Category name';
        var sortSign = '^';
        var revertSortSign = 'v';
        var parentCategory = 'Parent category';
        var addNewButton = 'New category';
        var refreshButton = 'Refresh';
        var separator = ' ';
        var picture = ' ';

        //scenario 1: default
        //when
        browser.get(HTTP_LOCALHOST_8889);

        //then
        expect(categoryNameHeader.getText()).toBe(categoryName + separator + sortSign);
        expect(parentCategoryHeader.getText()).toBe(parentCategory);
        expect(element(by.id('addNewCategoryButton')).getText()).toBe(picture + separator + addNewButton);
        expect(element(by.id('refreshButton')).getText()).toBe(picture + separator + refreshButton);

        //scenario 2: revert sort name
        //when
        categoryNameHeader.click();

        //then
        expect(categoryNameHeader.getText()).toBe(categoryName + separator + revertSortSign);
        expect(parentCategoryHeader.getText()).toBe(parentCategory);

        //scenario 3: sort parent name
        //when
        parentCategoryHeader.click();

        //then
        expect(categoryNameHeader.getText()).toBe(categoryName);
        expect(parentCategoryHeader.getText()).toBe(parentCategory + separator + sortSign);

        //scenario 4: sort parent name revert
        //when
        parentCategoryHeader.click();

        // then
        expect(categoryNameHeader.getText()).toBe(categoryName);
        expect(parentCategoryHeader.getText()).toBe(parentCategory + separator + revertSortSign);
    });

    //TODO: add modification step!
    xit('Should add, modify name and delete category', function() {
        //given
        var addNewCategoryButton = element(by.id('addNewCategoryButton'));
        var categoryNameA = 'CategoryA';
        var categoryNameX = 'CategoryX';

        //part1: add new category
        //when
        browser.get(HTTP_LOCALHOST_8889);
        addNewCategoryButton.click();
        element(by.id('newCategoryName')).sendKeys(categoryNameA);
        element(by.id('saveButton')).click();

        var response = browser.executeAsyncScript(function() {
            var callback = arguments[arguments.length - 1];
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    var response = xhr.responseText;
                    if(response.indexOf('CategoryA') != -1){
                        callback(xhr.responseText);
                    }else{
                        xhr.open('GET', 'http://localhost:8889/_ah/api/categoryendpoint/v1/category/', true);
                        xhr.send();
                    }
                }
            };
            xhr.open('GET', 'http://localhost:8889/_ah/api/categoryendpoint/v1/category/', true);
            xhr.send();
        });

        response.then(function(str){
            var dbId = JSON.parse(str).items[0].id.id;

            //then
            expect(element(by.id('categoryName_' + dbId)).getText()).toBe(categoryNameA);

            //part2: clean up - remove the category
            //when
            element(by.id('editButton_' + dbId)).click();
            element(by.id('deleteButton_' + dbId)).click();

            var bootboxContent = element(by.className('bootbox-body'));
            waitUntilReady(bootboxContent);
            expect(bootboxContent.getText()).toBe('Category "' + categoryNameA + '" will be removed. Continue?');
            element(by.buttonText('OK')).click();

            //then
            expect(element(by.id('categoryName_' + dbId)).isPresent()).toBe(false);
        });
    });

    it('Should add parent category and modify on parent\'s name change ', function() {
        //given
        var addNewCategoryButton = element(by.id('addNewCategoryButton'));
        var categoryNameA = 'CategoryA';
        var categoryNameB = 'CategoryB';
        var categoryNameX = 'CategoryX';


        //part1: add new category
        //when
        browser.get(HTTP_LOCALHOST_8889);
        addNewCategoryButton.click();
        element(by.id('newCategoryName')).sendKeys(categoryNameA);
        element(by.id('saveButton')).click();

        addNewCategoryButton.click();
        element(by.id('newCategoryName')).sendKeys(categoryNameB);
        element(by.id('saveButton')).click();

        var response = browser.executeAsyncScript(function() {
            var callback = arguments[arguments.length - 1];
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    var response = xhr.responseText;
                    if(response.indexOf('CategoryA') != -1 && response.indexOf('CategoryB') != -1){
                        callback(xhr.responseText);
                    }else{
                        xhr.open('GET', 'http://localhost:8889/_ah/api/categoryendpoint/v1/category/', true);
                        xhr.send();
                    }
                }
            };
            xhr.open('GET', 'http://localhost:8889/_ah/api/categoryendpoint/v1/category/', true);
            xhr.send();
        });

        response.then(function(str){
            var dbIdA;
            var dbIdB;
            if(JSON.parse(str).items[0].name === categoryNameA){
                dbIdA = JSON.parse(str).items[0].id.id;
                dbIdB = JSON.parse(str).items[1].id.id;
            }else{
                dbIdA = JSON.parse(str).items[1].id.id;
                dbIdB = JSON.parse(str).items[0].id.id;
            }

            //then
            expect(element(by.id('categoryName_' + dbIdA)).getText()).toBe(categoryNameA);
            expect(element(by.id('categoryName_' + dbIdB)).getText()).toBe(categoryNameB);

            //part2: add parent
            //when
            element(by.id('editButton_' + dbIdA)).click();
            var parentCategorySelector = element(by.id('editParentCategory_' + dbIdA));
            parentCategorySelector.click();
            parentCategorySelector.all(by.css('.chosen-results li')).filter(function(elem){
                return elem.getText().then(function(text){
                       return text === categoryNameB;
                    });
            }).then(function(filteredElements) {
                filteredElements[0].click();
                element(by.id('saveButton_' + dbIdA)).click();

                //then
                expect(element(by.id('parentCategory_' + dbIdA)).getText()).toBe(categoryNameB);

                //part3: edit parent name
                //when
                element(by.id('editButton_' + dbIdB)).click();
                element(by.id('editCategoryName_' + dbIdB)).clear();
                element(by.id('editCategoryName_' + dbIdB)).sendKeys(categoryNameX);
                element(by.id('saveButton_' + dbIdB)).click();

                //then
                expect(element(by.id('categoryName_' + dbIdA)).getText()).toBe(categoryNameA);
                expect(element(by.id('categoryName_' + dbIdB)).getText()).toBe(categoryNameX);
                expect(element(by.id('parentCategory_' + dbIdA)).getText()).toBe(categoryNameX);
            });

            //var bootboxContent = element(by.className('bootbox-body'));
            //waitUntilReady(bootboxContent);
            //expect(bootboxContent.getText()).toBe('Category "' + newCategoryName + '" will be removed. Continue?');
            //element(by.buttonText('OK')).click();
            //
            ////then
            //expect(element(by.id('categoryName_' + dbId)).isPresent()).toBe(false);
        });
    });

});
