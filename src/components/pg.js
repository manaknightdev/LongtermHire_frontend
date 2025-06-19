// list out all folders in the directory
const fs = require("fs");
const path = require("path");

// define the path to the directory
const folderPath = path.join(__dirname);

// list out all folders in the directory
const items = fs.readdirSync(folderPath);

// filter only folders and get their full paths
const folders = items
  .filter((item) => {
    const itemPath = path.join(folderPath, item);
    return fs.statSync(itemPath).isDirectory();
  })
  .map((folder) => {
    return path.join(folderPath, folder);
  });

console.log("Full folder paths:");
folders.forEach((folderPath) => {
  console.log(folderPath);
});

//  src/components/AdminHeader
//  src/components/AdminWrapper
//  src/components/CircularImagePreview
//  src/components/CodeEditor
//  src/components/Collapser
//  src/components/CollapsibleMenu
//  src/components/Container
//  src/components/CreateNewRoomModal
//  src/components/CustomSelect
//  src/components/DashboardUI
//  src/components/DateRange
//  src/components/Deployment
//  src/components/DisplayDomainUrl
//  src/components/DropdownOptions
//  src/components/DynamicContentType
//  src/components/Editor
//  src/components/EditWireframeTabs
//  src/components/ErrorBoundary
//  src/components/ExportButton
//  src/components/ExternalUI
//  src/components/HeaderLogo
//  src/components/HorizontalNavbar
//  src/components/ImagePreviewModal
//  src/components/InteractiveButton
//  src/components/InteractiveMap
//  src/components/LandingPage
//  src/components/LazyLoad
//  src/components/Loader
//  src/components/LoadingIndicator
//  src/components/MkdButton
//  src/components/MkdCalendar
//  src/components/MkdControlledInput
//  src/components/MkdDebounceInput
//  src/components/MkdFileTable
//  src/components/MKDForm
//  src/components/MkdInfiniteScroll
//  src/components/MkdInput
//  src/components/MkdInputV2
//  src/components/MkdJsonQuiz
//  src/components/MkdListTable
//  src/components/MkdLoader
//  src/components/MkdPasswordInput
//  src/components/MkdPopover
//  src/components/MkdSimpleTable
//  src/components/MkdTabContainer
//  src/components/MkdWizardContainer
//  src/components/Modal
//  src/components/ModalSidebar
//  src/components/MultipleAnswer
//  src/components/MultiSelect
//  src/components/Notifications
//  src/components/OfflineAwareForm
//  src/components/OfflineExample
//  src/components/OfflineIndicator
//  src/components/OfflineNotifications
//  src/components/OfflineStatusBar
//  src/components/PaginationBar
//  src/components/ProfileImageUpload
//  src/components/ProgressBar
//  src/components/PublicHeader
//  src/components/PublicWrapper
//  src/components/QrCodeGenerator
//  src/components/QrCodeReader
//  src/components/RatingStar
//  src/components/RouteChangeModal
//  src/components/SearchableDropdown
//  src/components/SessionExpiredModal
//  src/components/SimpleViewWrapper
//  src/components/Skeleton
//  src/components/SnackBar
//  src/components/SyncDashboard
//  src/components/SyncStatusIndicator
//  src/components/ThemeStyles
//  src/components/ThemeToggle
//  src/components/Title
//  src/components/TitleDetail
//  src/components/Toast
//  src/components/TopBarSticky
//  src/components/TopHeader
//  src/components/UploadConfig
//  src/components/UserProfile
//  src/components/video
//  src/components/ViewModelItem
//  src/components/ViewWrapper

// fetch("https://baas.mytechpassport.com/v1/api/records/core/super_admin/project", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9,zh;q=0.8,zh-HK;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5",
//     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJpYXQiOjE3NTAyODM2OTIsImV4cCI6MTc1MDI4NzI5Mn0.fMUnr3uJdzAducA50QGBuc2aTqkvPMYX5dzF916UqZs",
//     "cache-control": "no-cache",
//     "content-type": "application/json, application/json",
//     "pragma": "no-cache",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "cross-site",
//     "x-project": "Y29yZTozYzN3MHUwc2N2bWN2MzlxMGJyb2RzMWl2MTFxNm41bGY="
//   },
//   "referrer": "http://localhost:3001/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"name\":\"Benjamin Ahunanya\",\"slug\":\"splat\",\"hostname\":\"splat.manaknightdigital.com\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
