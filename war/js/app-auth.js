var CLIENT_ID = '1038988444391-bvd0to4hgd0mkfg9hunpqkcj3089hovq.apps.googleusercontent.com';

var SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets',
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/userinfo.profile' ];

function checkAuth() {
	gapi.auth.authorize({
		'client_id' : CLIENT_ID,
		'scope' : SCOPES.join(' '),
		'immediate' : true
	}, handleAuthResult);
}

function handleAuthResult(authResult) {
	appendPre(JSON.stringify(authResult));
	if (authResult && !authResult.error) {

//		// Make the API request.
//		var op = gapi.client.request({
//			'root' : 'https://www.googleapis.com',
//			'path' : 'oauth2/v1/userinfo',
//			'method' : 'GET',
//		// 'body': request
//		});
//
//		op.execute(function(resp) {
//			if (resp.error) {
//				appendPre(JSON.stringify(resp));
//			} else {
//				appendPre(JSON.stringify(resp));
//			}
//		});
//
//		callScriptFunction('createFolderAndSheetFile');
	} else {
		gapi.auth.authorize({
			'client_id' : CLIENT_ID,
			'scope' : SCOPES.join(' '),
			'immediate' : false
		}, handleAuthResult);
	}
}

function handleAuthClick() {
	checkAuth();
	//return false;
}

function callScriptFunction(functionName, parameters) {
	var scriptId = "MbIEcQFOqy8BdvgfVV-hhRqHVcGstMHy0";

	// Create an execution request object.
	var request = {
		'function' : functionName,
		'parameters' : parameters,
		'devMode' : true
	};

	// Make the API request.
	var op = gapi.client.request({
		'root' : 'https://script.googleapis.com',
		'path' : 'v1/scripts/' + scriptId + ':run',
		'method' : 'POST',
		'body' : request
	});

	op.execute(function(resp) {
		if (resp.error) {
			appendPre(JSON.stringify(resp));
		} else {
			appendPre(JSON.stringify(resp));

//			var documentId = resp.response.result;
//			appendPre(documentId);
//			if ('createFolderAndSheetFile' == functionName) {
//				for (var i = 0; i < 1; ++i) {
//					callScriptFunction('addProduct', [ documentId, i ]);
//				}
//			}

		}
	});
}

function appendPre(message) {
	var pre = document.getElementById('alerts');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}
