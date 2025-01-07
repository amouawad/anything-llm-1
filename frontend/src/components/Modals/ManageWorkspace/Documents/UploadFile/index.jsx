import { CloudArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { v4 } from "uuid";
import FileUploadProgress from "./FileUploadProgress";
import Workspace from "../../../../../models/workspace";
import debounce from "lodash.debounce";
import { API_BASE } from "@/utils/constants";

export default function UploadFile({
  workspace,
  fetchKeys,
  setLoading,
  setLoadingMessage,
}) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Scraping link...");
    setFetchingUrl(true);
    const formEl = e.target;
    const form = new FormData(formEl);
    const { response, data } = await Workspace.uploadLink(
      workspace.slug,
      form.get("link")
    );
    if (!response.ok) {
      showToast(`Error uploading link: ${data.error}`, "error");
    } else {
      fetchKeys(true);
      showToast("Link uploaded successfully", "success");
      formEl.reset();
    }
    setLoading(false);
    setFetchingUrl(false);
  };

  // Don't spam fetchKeys, wait 1s between calls at least.
  const handleUploadSuccess = debounce(() => fetchKeys(true), 1000);
  const handleUploadError = (_msg) => null; // stubbed.

  const uploadFilesFromFolder = async () => {
    try {
      // Use File System Access API or relevant server-side API to get files from a folder

      const response = await fetch(`${API_BASE}/list-files`); // Example endpoint to fetch file list
      if (!response.ok) {
        throw new Error("Failed to fetch files from the folder Lalalaala ", response);
      }
      const fileList = await response.json();
      const formattedFiles = fileList.map((file) => ({
        uid: v4(),
        file,
      }));

      setFiles([formattedFiles[0]]);
    } catch (error) {
      showToast(`Error accessing folder:  ${error.message}`, "error");
    }
  };

  useEffect(() => {
    async function checkProcessorOnline() {
      const online = await System.checkDocumentProcessorOnline();
      setReady(online);
    }
    checkProcessorOnline();
  }, []);

  return (
    <div>
      <button
        onClick={uploadFilesFromFolder}
        disabled={!ready}
        className={`w-[560px] p-3 mb-4 text-white border-2 rounded-2xl bg-zinc-900/50 ${ready ? "cursor-pointer hover:bg-zinc-900/90" : "cursor-not-allowed"
          }`}
      >
        <CloudArrowUp className="w-8 h-8 text-white/80 inline-block mr-2" />
        {ready ? "Sync Files from Folder" : "Document Processor Unavailable"}
      </button>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[180px] p-1 overflow-y-scroll no-scroll">
          {files.map((file) => (
            <FileUploadProgress
              key={file.uid}
              file={file.file}
              uuid={file.uid}
              setFiles={setFiles}
              slug={workspace.slug}
              rejected={file?.rejected}
              reason={file?.reason}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              setLoading={setLoading}
              setLoadingMessage={setLoadingMessage}
            />
          ))}
        </div>
      )}
      <div className="text-center text-white text-opacity-50 text-xs font-medium w-[560px] py-2">
        or submit a link
      </div>
      <form onSubmit={handleSendLink} className="flex gap-x-2">
        <input
          disabled={fetchingUrl}
          name="link"
          type="url"
          className="disabled:bg-dark-highlight disabled:text-slate-300 bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5"
          placeholder={"https://example.com"}
          autoComplete="off"
        />
        <button
          disabled={fetchingUrl}
          type="submit"
          className="disabled:bg-white/20 disabled:text-slate-300 disabled:border-slate-400 disabled:cursor-wait bg bg-transparent hover:bg-slate-200 hover:text-slate-800 w-auto border border-white text-sm text-white p-2.5 rounded-lg"
        >
          {fetchingUrl ? "Fetching..." : "Fetch website"}
        </button>
      </form>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to the document processor running on this
        AnythingLLM instance. These files are not sent or shared with a third
        party.
      </div>
    </div>
  );
}
