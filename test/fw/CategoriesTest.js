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

    it('Should add and delete category', function() {
        //given
        var addNewCategoryButton = element(by.id('addNewCategoryButton'));
        var newCategoryName = 'New test category';

        //part1: add new category
        //when
        browser.get(HTTP_LOCALHOST_8889);
        addNewCategoryButton.click();
        element(by.id('newCategoryName')).sendKeys(newCategoryName);
        element(by.id('saveButton')).click();

        var response = browser.executeAsyncScript(function() {
            var callback = arguments[arguments.length - 1];
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    var response = xhr.responseText;
                    if(response.indexOf('id') != -1){
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
            expect(element(by.id('categoryName_' + dbId)).getText()).toBe(newCategoryName);

            //part2: clean up - remove the category
            //when
            element(by.id('editButton_' + dbId)).click();
            element(by.id('deleteButton_' + dbId)).click();

            var bootboxContent = element(by.className('bootbox-body'));
            waitUntilReady(bootboxContent);
            expect(bootboxContent.getText()).toBe('Category "' + newCategoryName + '" will be removed. Continue?');
            element(by.buttonText('OK')).click();

            //then
            expect(element(by.id('categoryName_' + dbId)).isPresent()).toBe(false);
        });
    });
});

//
//
//
//@Test
//public void shouldAddAndDeleteCategory() throws Exception {
//    // given
//    By addNewButtonCondition = By.id("addNewCategoryButton");
//    By newCategoryFieldCondition = By.id("newCategoryName");
//    By saveNewButtonCondition = By.id("saveButton");
//
//    By categoryRowCondition = By.id("categoryRow");
//    String categoryNameIdPrefix = "categoryName";
//    String editButtonIdPrefix = "editButton";
//    String deleteButtonIdPrefix = "deleteButton";
//
//    String newCategoryName = "New test category";
//    String deleteConfirmationMessage = "Category \"" + newCategoryName + "\" will be removed. Continue?";
//    By bootboxConfirmationCondition = By.xpath("//div[text()='" + deleteConfirmationMessage + "']");
//    By bootboxConfirmationButton = By.xpath("//button[text()='OK']");
//    By bootboxWindowCondition = By.xpath("//div[@class[bootbox modal fade bootbox-confirm in]]");
//
//    WebDriverWait wait = new WebDriverWait(driver, 10);
//
//    // step 1: add new
//    // when
//    wait.until(ExpectedConditions.visibilityOfElementLocated(addNewButtonCondition));
//    driver.findElement(addNewButtonCondition).click();
//
//    wait.until(ExpectedConditions.visibilityOfElementLocated(newCategoryFieldCondition));
//    wait.until(ExpectedConditions.visibilityOfElementLocated(saveNewButtonCondition));
//    driver.findElement(newCategoryFieldCondition).sendKeys(newCategoryName);
//    driver.findElement(saveNewButtonCondition).click();
//
//    wait.until(ExpectedConditions.visibilityOfElementLocated(categoryRowCondition));
//
//    //then
//    List<WebElement> categoryRows = driver.findElements(categoryRowCondition);
//    //assertThat(categoryRows).hasSize(1);
//
//    Map<String, String> responseParsed = getJsonResponse("GET","");
//
//    assertEquals("Category", responseParsed.get("kind"));
//    assertEquals("formularz-wydatkow", responseParsed.get("appId"));
//    assertEquals("true", responseParsed.get("complete"));
//    assertEquals(newCategoryName, responseParsed.get("name"));
//
//    String id = responseParsed.get("id");
//    assertEquals(newCategoryName, driver.findElement(By.id(categoryNameIdPrefix + SEPARATOR + id)).getText());
//
//    // step2: clean up - delete
//    // when
//    driver.findElement(By.id(editButtonIdPrefix + SEPARATOR + id)).click();
//
//    By deleteButtonCondition = By.id(deleteButtonIdPrefix + SEPARATOR + id);
//    wait.until(ExpectedConditions.visibilityOfElementLocated(deleteButtonCondition));
//    driver.findElement(deleteButtonCondition).click();
//
//    wait.until(ExpectedConditions.visibilityOfElementLocated(bootboxConfirmationCondition));
//    assertEquals(deleteConfirmationMessage, driver.findElement(bootboxConfirmationCondition).getText());
//    wait.until(ExpectedConditions.visibilityOfElementLocated(bootboxConfirmationButton));
//    driver.findElement(bootboxConfirmationButton).click();
//
//    wait.until(ExpectedConditions.invisibilityOfElementLocated(bootboxWindowCondition));
//
//    // then
//    assertThat(driver.findElements(categoryRowCondition)).isEmpty();
//}
