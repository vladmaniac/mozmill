// ***** BEGIN LICENSE BLOCK *****
// Version: MPL 1.1/GPL 2.0/LGPL 2.1
// 
// The contents of this file are subject to the Mozilla Public License Version
// 1.1 (the "License"); you may not use this file except in compliance with
// the License. You may obtain a copy of the License at
// http://www.mozilla.org/MPL/
// 
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
// for the specific language governing rights and limitations under the
// License.
// 
// The Original Code is Mozilla Corporation Code.
// 
// The Initial Developer of the Original Code is
// Adam Christian.
// Portions created by the Initial Developer are Copyright (C) 2008
// the Initial Developer. All Rights Reserved.
// 
// Contributor(s):
//  Adam Christian <adam.christian@gmail.com>
//  Mikeal Rogers <mikeal.rogers@gmail.com>
// 
// Alternatively, the contents of this file may be used under the terms of
// either the GNU General Public License Version 2 or later (the "GPL"), or
// the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
// in which case the provisions of the GPL or the LGPL are applicable instead
// of those above. If you wish to allow use of your version of this file only
// under the terms of either the GPL or the LGPL, and not to allow others to
// use your version of this file under the terms of the MPL, indicate your
// decision by deleting the provisions above and replace them with the notice
// and other provisions required by the GPL or the LGPL. If you do not delete
// the provisions above, a recipient may use your version of this file under
// the terms of any one of the MPL, the GPL or the LGPL.
// 
// ***** END LICENSE BLOCK *****

var frame = {}; Components.utils.import('resource://mozmill/modules/frame.js', frame);

function openFile(){
  var openFn = utils.openFile(window);
  if (openFn){
    window.openFn = openFn;
    //$('saveMenu').removeAttribute("disabled");
    $('closeMenu').removeAttribute("disabled");
    $('editorMessage').innerHTML = "Loaded File: " + window.openFn;
    $('reloadBtn').style.visibility = "visible";
  }
}

function saveAsFile() {
  var openFn = utils.saveAsFile(window);
  if (openFn){
    window.openFn = openFn;
    //$('saveMenu').removeAttribute("disabled");
    $('closeMenu').removeAttribute("disabled");
    $('editorMessage').innerHTML = "Loaded File: " + window.openFn;
    $('reloadBtn').style.visibility = "visible";
  }
}

function saveFile() {
  //if ($('saveMenu').getAttribute("disabled")){ return; }
  $('saveMenu').setAttribute("disabled", "true");
  utils.saveFile(window);
}

function changeEditor() {
  $('saveMenu').setAttribute("disabled", "false");
}

function closeFile() {
 if ($('closeMenu').getAttribute("disabled")){ return; }
 var really = confirm("Are you sure you want to close this file?");
 if (really == true) {
   $('editorInput').value = '';
   delete window.openFn;
   $('saveMenu').setAttribute("disabled","true");
   $('closeMenu').setAttribute("disabled","true");
   $('editorMessage').innerHTML = 'Please open a test, or generate and save a new one..';
   $('reloadBtn').style.visibility = "hidden";
 }
}

function runFile(){
  $('runningStatus').textContent = 'Status: Running File...';
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, "Select a File", nsIFilePicker.modeOpen);
  fp.appendFilter("JavaScript Files","*.js");
  var res = fp.show();
  if (res == nsIFilePicker.returnOK){
    frame.runTestFile(fp.file.path);
  }
  $('runningStatus').textContent = 'Status: See Output Tab...';
}

function runDirectory(){
  $('runningStatus').textContent = 'Status: Running File...';
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, "Select a Directory", nsIFilePicker.modeGetFolder);
  var res = fp.show();
  if (res == nsIFilePicker.returnOK){
    frame.runTestDirectory(fp.file.path);
  }
  $('runningStatus').textContent = 'Status: See Output Tab...';
}

function reloadFile(){
   var data = utils.getFile(window.openFn);
   $('editorInput').value = data;
}

function runEditor(){
  var doRun = function(){
    $('runningStatus').textContent = 'Status: Running Test...';
    //utils.runEditor(window);
    frame.runTestFile(window.openFn);
    $('runningStatus').textContent = 'Status: See Output Tab...';
  }
  //If there isn't a file system pointer to a test open
  if (!window.openFn){
    alert('You must save this test to the file system before it can be run, See: File > Save As.');
    return;
  }
  //if the test is open but hasn't been modified
  if ($('saveMenu').getAttribute("disabled") == "true"){
    doRun();
  }
  //if the test was modified
  else {
    really = confirm("To run this file you must save it, shall I do this for you?");
    if (really){
      saveFile();
      doRun();
    } else { return; }
  }
}

function genBoiler(){
  utils.genBoiler(window);
  $('editorMessage').innerHTML = "You must save this as a file before you run it..";
}

function logicalClear(){
  var idx = $('mmtabs').selectedIndex;
  if (idx == 0){ $('editorInput').value = ''; }
  else if (idx == 1){ $('resOut').textContent = ''; }
  else if (idx == 2){ $('perfOut').textContent = ''; }
}

function accessOutput(){
  var copyOutputBox = $('copyout');
  var dx = $('dxContainer')
  var dxDisp = $('dxDisplay');
  
  // //if copyable output is shown
  //  if (!copyOutputBox.getAttribute("checked")){
  //   dx.style.display = 'none';
  //   dxDisp.textContent = '';
  //   return;
  //  }
  
  var n = $('outputtab');
  var txt = '';
  for (var c = 0; c < n.childNodes.length; c++){
    if (n.childNodes[c].textContent){
      txt += n.childNodes[c].textContent + '\n';  
    }
    else{
      txt += n.childNodes[c].value + '\n';
    }
  }
  if (txt == undefined){ return; }
  
  dx.style.display = 'block';
  dxDisp.textContent = txt;
}