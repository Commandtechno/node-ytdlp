import { exec, execSync, spawn } from "child_process";
import { join } from "path";

export let ytdlpPath: string;

switch (process.platform) {
	case "win32":
		ytdlpPath = join(__dirname, "bin", "bindows.exe");
		break;

	case "linux":
		ytdlpPath = join(__dirname, "bin", "binux");
		break;

	case "darwin":
		ytdlpPath = join(__dirname, "bin", "bacos");
		break;

	default:
		throw new Error(`Unsupported platform: ${process.platform}`);
}

export interface Options {
	/**
	 * @description Print this help text and exit
	 */
	help?: boolean
	/**
	 * @description Print program version and exit
	 */
	version?: boolean
	/**
	 * @description Update this program to latest version. Make sure that you have sufficient permissions (run with sudo if needed)
	 */
	update?: boolean
	/**
	 * @description Ignore download and postprocessing errors. The download will be considered successful even if the postprocessing fails
	 */
	ignoreErrors?: boolean
	/**
	 * @description Continue with next video on download errors; e.g. to skip unavailable videos in a playlist (default)
	 */
	noAbortOnError?: boolean
	/**
	 * @description Abort downloading of further videos if an error occurs (Alias: --no-ignore-errors)
	 */
	abortOnError?: boolean
	/**
	 * @description Display the current user-agent and exit
	 */
	dumpUserAgent?: boolean
	/**
	 * @description List all supported extractors and exit
	 */
	listExtractors?: boolean
	/**
	 * @description Output descriptions of all supported extractors and exit
	 */
	extractorDescriptions?: boolean
	/**
	 * @description Force extraction to use the generic extractor
	 */
	forceGenericExtractor?: boolean
	/**
	 * @description Use this prefix for unqualified URLs. For example "gvsearch2:" downloads two videos from google videos for the search term "large apple". Use the value "auto" to let yt-dlp guess ("auto_warning" to emit a warning when guessing). "error" just throws an error. The default value "fixup_error" repairs broken URLs, but emits an error if this is not possible instead of searching
	 */
	defaultSearch?: string | string[]
	/**
	 * @description Don't load any more configuration files except those given by --config-locations. For backward compatibility, if this option is found inside the system configuration file, the user configuration is not loaded. (Alias: --no-config)
	 */
	ignoreConfig?: boolean
	/**
	 * @description Do not load any custom configuration files (default). When given inside a configuration file, ignore all previous --config-locations defined in the current file
	 */
	noConfigLocations?: boolean
	/**
	 * @description Location of the main configuration file; either the path to the config or its containing directory. Can be used multiple times and inside other configuration files
	 */
	configLocations?: string | string[]
	/**
	 * @description Do not extract the videos of a playlist, only list them
	 */
	flatPlaylist?: boolean
	/**
	 * @description Extract the videos of a playlist
	 */
	noFlatPlaylist?: boolean
	/**
	 * @description Download livestreams from the start. Currently only supported for YouTube (Experimental)
	 */
	liveFromStart?: boolean
	/**
	 * @description Download livestreams from the current time (default)
	 */
	noLiveFromStart?: boolean
	/**
	 * @description Wait for scheduled streams to become available. Pass the minimum number of seconds (or range) to wait between retries
	 */
	waitForVideo?: string | string[]
	/**
	 * @description Do not wait for scheduled streams (default)
	 */
	noWaitForVideo?: boolean
	/**
	 * @description Mark videos watched (even with --simulate). Currently only supported for YouTube
	 */
	markWatched?: boolean
	/**
	 * @description Do not mark videos watched (default)
	 */
	noMarkWatched?: boolean
	/**
	 * @description Do not emit color codes in output
	 */
	noColors?: boolean
	/**
	 * @description Options that can help keep compatibility with youtube-dl or youtube-dlc configurations by reverting some of the changes made in yt-dlp. See "Differences in default behavior" for details 
	 */
	compatOptions?: string | string[]
	/**
	 * @description Use the specified HTTP/HTTPS/SOCKS proxy. To enable SOCKS proxy, specify a proper scheme. For example socks5://user:pass@127.0.0.1:1080/. Pass in an empty string (--proxy "") for direct connection
	 */
	proxy?: string | string[]
	/**
	 * @description Time to wait before giving up, in seconds
	 */
	socketTimeout?: string | string[]
	/**
	 * @description Client-side IP address to bind to
	 */
	sourceAddress?: string | string[]
	/**
	 * @description Make all connections via IPv4
	 */
	forceIpv4?: boolean
	/**
	 * @description Make all connections via IPv6 
	 */
	forceIpv6?: boolean
	/**
	 * @description Use this proxy to verify the IP address for some geo-restricted sites. The default proxy specified by --proxy (or none, if the option is not present) is used for the actual downloading
	 */
	geoVerificationProxy?: string | string[]
	/**
	 * @description Bypass geographic restriction via faking X-Forwarded-For HTTP header (default)
	 */
	geoBypass?: boolean
	/**
	 * @description Do not bypass geographic restriction via faking X-Forwarded-For HTTP header
	 */
	noGeoBypass?: boolean
	/**
	 * @description Force bypass geographic restriction with explicitly provided two-letter ISO 3166-2 country code
	 */
	geoBypassCountry?: string | string[]
	/**
	 * @description Force bypass geographic restriction with explicitly provided IP block in CIDR notation 
	 */
	geoBypassIpBlock?: string | string[]
	/**
	 * @description Playlist video to start at (default is 1)
	 */
	playlistStart?: string | string[]
	/**
	 * @description Playlist video to end at (default is last)
	 */
	playlistEnd?: string | string[]
	/**
	 * @description Playlist video items to download. Specify indices of the videos in the playlist separated by commas like: "--playlist-items 1,2,5,8" if you want to download videos indexed 1, 2, 5, 8 in the playlist. You can specify range: "--playlist-items 1-3,7,10-13", it will download the videos at index 1, 2, 3, 7, 10, 11, 12 and 13
	 */
	playlistItems?: string | string[]
	/**
	 * @description Do not download any videos smaller than SIZE (e.g. 50k or 44.6m)
	 */
	minFilesize?: string | string[]
	/**
	 * @description Do not download any videos larger than SIZE (e.g. 50k or 44.6m)
	 */
	maxFilesize?: string | string[]
	/**
	 * @description Download only videos uploaded on this date. The date can be "YYYYMMDD" or in the format "(now|today)[+-][0-9](day|week|month|year)( s)?"
	 */
	date?: string | string[]
	/**
	 * @description Download only videos uploaded on or before this date. The date formats accepted is the same as --date
	 */
	datebefore?: string | string[]
	/**
	 * @description Download only videos uploaded on or after this date. The date formats accepted is the same as --date
	 */
	dateafter?: string | string[]
	/**
	 * @description Generic video filter. Any field (see "OUTPUT TEMPLATE") can be compared with a number or a string using the operators defined in "Filtering formats". You can also simply specify a field to match if the field is present and "!field" to check if the field is not present. In addition, Python style regular expression matching can be done using "~=", and multiple filters can be checked with "&". Use a "\" to escape "&" or quotes if needed. Eg: --match-filter "!is_live & like_count>?100 & description~='(?i)\bcats \& dogs\b'" matches only videos that are not live, has a like count more than 100 (or the like field is not available), and also has a description that contains the phrase "cats & dogs" (ignoring case)
	 */
	matchFilter?: string | string[]
	/**
	 * @description Do not use generic video filter (default)
	 */
	noMatchFilter?: boolean
	/**
	 * @description Download only the video, if the URL refers to a video and a playlist
	 */
	noPlaylist?: boolean
	/**
	 * @description Download the playlist, if the URL refers to a video and a playlist
	 */
	yesPlaylist?: boolean
	/**
	 * @description Download only videos suitable for the given age
	 */
	ageLimit?: string | string[]
	/**
	 * @description Download only videos not listed in the archive file. Record the IDs of all downloaded videos in it
	 */
	downloadArchive?: string | string[]
	/**
	 * @description Do not use archive file (default)
	 */
	noDownloadArchive?: boolean
	/**
	 * @description Abort after downloading NUMBER files
	 */
	maxDownloads?: string | string[]
	/**
	 * @description Stop the download process when encountering a file that is in the archive
	 */
	breakOnExisting?: boolean
	/**
	 * @description Stop the download process when encountering a file that has been filtered out
	 */
	breakOnReject?: boolean
	/**
	 * @description Make --break-on-existing and --break-on- reject act only on the current input URL
	 */
	breakPerInput?: boolean
	/**
	 * @description --break-on-existing and --break-on-reject terminates the entire download queue
	 */
	noBreakPerInput?: boolean
	/**
	 * @description Number of allowed failures until the rest of the playlist is skipped 
	 */
	skipPlaylistAfterErrors?: string | string[]
	/**
	 * @description Number of fragments of a dash/hlsnative video that should be downloaded concurrently (default is 1)
	 */
	concurrentFragments?: string | string[]
	/**
	 * @description Maximum download rate in bytes per second (e.g. 50K or 4.2M)
	 */
	limitRate?: string | string[]
	/**
	 * @description Minimum download rate in bytes per second below which throttling is assumed and the video data is re-extracted (e.g. 100K)
	 */
	throttledRate?: string | string[]
	/**
	 * @description Number of retries (default is 10), or "infinite"
	 */
	retries?: string | string[]
	/**
	 * @description Number of times to retry on file access error (default is 10), or "infinite"
	 */
	fileAccessRetries?: string | string[]
	/**
	 * @description Number of retries for a fragment (default is 10), or "infinite" (DASH, hlsnative and ISM)
	 */
	fragmentRetries?: string | string[]
	/**
	 * @description Skip unavailable fragments for DASH, hlsnative and ISM (default) (Alias: --no- abort-on-unavailable-fragment)
	 */
	skipUnavailableFragments?: boolean
	/**
	 * @description  unavailable (Alias: --no-skip-unavailable- fragments)
	 */
	abortOnUnavailableFragment?: string | string[]
	/**
	 * @description Keep downloaded fragments on disk after downloading is finished
	 */
	keepFragments?: boolean
	/**
	 * @description Delete downloaded fragments after downloading is finished (default)
	 */
	noKeepFragments?: boolean
	/**
	 * @description Size of download buffer (e.g. 1024 or 16K) (default is 1024)
	 */
	bufferSize?: string | string[]
	/**
	 * @description The buffer size is automatically resized from an initial value of --buffer-size (default)
	 */
	resizeBuffer?: boolean
	/**
	 * @description Do not automatically adjust the buffer size
	 */
	noResizeBuffer?: boolean
	/**
	 * @description Size of a chunk for chunk-based HTTP downloading (e.g. 10485760 or 10M) (default is disabled). May be useful for bypassing bandwidth throttling imposed by a webserver (experimental)
	 */
	httpChunkSize?: string | string[]
	/**
	 * @description Download playlist videos in reverse order
	 */
	playlistReverse?: boolean
	/**
	 * @description Download playlist videos in default order (default)
	 */
	noPlaylistReverse?: boolean
	/**
	 * @description Download playlist videos in random order
	 */
	playlistRandom?: boolean
	/**
	 * @description Set file xattribute ytdl.filesize with expected file size
	 */
	xattrSetFilesize?: boolean
	/**
	 * @description Use the mpegts container for HLS videos; allowing some players to play the video while downloading, and reducing the chance of file corruption if download is interrupted. This is enabled by default for live streams
	 */
	hlsUseMpegts?: boolean
	/**
	 * @description Do not use the mpegts container for HLS videos. This is default when not downloading live streams
	 */
	noHlsUseMpegts?: boolean
	/**
	 * @description Name or path of the external downloader to use (optionally) prefixed by the protocols (http, ftp, m3u8, dash, rstp, rtmp, mms) to use it for. Currently supports native, aria2c, avconv, axel, curl, ffmpeg, httpie, wget (Recommended: aria2c). You can use this option multiple times to set different downloaders for different protocols. For example, --downloader aria2c --downloader "dash,m3u8:native" will use aria2c for http/ftp downloads, and the native downloader for dash/m3u8 downloads (Alias: --external-downloader)
	 */
	downloader?: string | string[]
	/**
	 * @description Give these arguments to the external downloader. Specify the downloader name and the arguments separated by a colon ":". For ffmpeg, arguments can be passed to different positions using the same syntax as --postprocessor-args. You can use this option multiple times to give different arguments to different downloaders (Alias: --external-downloader-args) 
	 */
	downloaderArgs?: string | string[]
	/**
	 * @description File containing URLs to download ("-" for stdin), one URL per line. Lines starting with "#", ";" or "]" are considered as comments and ignored
	 */
	batchFile?: string | string[]
	/**
	 * @description Do not read URLs from batch file (default)
	 */
	noBatchFile?: boolean
	/**
	 * @description The paths where the files should be downloaded. Specify the type of file and the path separated by a colon ":". All the same TYPES as --output are supported. Additionally, you can also provide "home" (default) and "temp" paths. All intermediary files are first downloaded to the temp path and then the final files are moved over to the home path after download is finished. This option is ignored if --output is an absolute path
	 */
	paths?: string | string[]
	/**
	 * @description Output filename template; see "OUTPUT TEMPLATE" for details
	 */
	output?: string | string[]
	/**
	 * @description Placeholder value for unavailable meta fields in output filename template (default: "NA")
	 */
	outputNaPlaceholder?: string | string[]
	/**
	 * @description Restrict filenames to only ASCII characters, and avoid "&" and spaces in filenames
	 */
	restrictFilenames?: boolean
	/**
	 * @description Allow Unicode characters, "&" and spaces in filenames (default)
	 */
	noRestrictFilenames?: boolean
	/**
	 * @description Force filenames to be Windows-compatible
	 */
	windowsFilenames?: boolean
	/**
	 * @description Make filenames Windows-compatible only if using Windows (default)
	 */
	noWindowsFilenames?: boolean
	/**
	 * @description Limit the filename length (excluding extension) to the specified number of characters
	 */
	trimFilenames?: string | string[]
	/**
	 * @description Do not overwrite any files
	 */
	noOverwrites?: boolean
	/**
	 * @description Overwrite all video and metadata files. This option includes --no-continue
	 */
	forceOverwrites?: boolean
	/**
	 * @description Do not overwrite the video, but overwrite related files (default)
	 */
	noForceOverwrites?: boolean
	/**
	 * @description Resume partially downloaded files/fragments (default)
	 */
	continue?: boolean
	/**
	 * @description Do not resume partially downloaded fragments. If the file is not fragmented, restart download of the entire file
	 */
	noContinue?: boolean
	/**
	 * @description Use .part files instead of writing directly into output file (default)
	 */
	part?: boolean
	/**
	 * @description Do not use .part files - write directly into output file
	 */
	noPart?: boolean
	/**
	 * @description Use the Last-modified header to set the file modification time (default)
	 */
	mtime?: boolean
	/**
	 * @description Do not use the Last-modified header to set the file modification time
	 */
	noMtime?: boolean
	/**
	 * @description Write video description to a .description file
	 */
	writeDescription?: boolean
	/**
	 * @description Do not write video description (default)
	 */
	noWriteDescription?: boolean
	/**
	 * @description Write video metadata to a .info.json file (this may contain personal information)
	 */
	writeInfoJson?: boolean
	/**
	 * @description Do not write video metadata (default)
	 */
	noWriteInfoJson?: boolean
	/**
	 * @description Write playlist metadata in addition to the video metadata when using --write-info- json, --write-description etc. (default)
	 */
	writePlaylistMetafiles?: boolean
	/**
	 * @description Do not write playlist metadata when using --write-info-json, --write-description etc.
	 */
	noWritePlaylistMetafiles?: boolean
	/**
	 * @description Remove some private fields such as filenames from the infojson. Note that it could still contain some personal information (default)
	 */
	cleanInfojson?: boolean
	/**
	 * @description Write all fields to the infojson
	 */
	noCleanInfojson?: boolean
	/**
	 * @description Retrieve video comments to be placed in the infojson. The comments are fetched even without this option if the extraction is known to be quick (Alias: --get-comments)
	 */
	writeComments?: boolean
	/**
	 * @description Do not retrieve video comments unless the extraction is known to be quick (Alias: --no-get-comments)
	 */
	noWriteComments?: boolean
	/**
	 * @description JSON file containing the video information (created with the "--write-info-json" option)
	 */
	loadInfoJson?: string | string[]
	/**
	 * @description Netscape formatted file to read cookies from and dump cookie jar in
	 */
	cookies?: string | string[]
	/**
	 * @description Do not read/dump cookies from/to file (default)
	 */
	noCookies?: boolean
	/**
	 * @description  The name of the browser and (optionally) the name/path of the profile to load cookies from, separated by a ":". Currently supported browsers are: brave, chrome, chromium, edge, firefox, opera, safari, vivaldi. By default, the most recently accessed profile is used. The keyring used for decrypting Chromium cookies on Linux can be (optionally) specified after the browser name separated by a "+". Currently supported keyrings are: basictext, gnomekeyring, kwallet
	 */
	cookiesFromBrowser?: string | string[]
	/**
	 * @description Do not load cookies from browser (default)
	 */
	noCookiesFromBrowser?: boolean
	/**
	 * @description Location in the filesystem where youtube-dl can store some downloaded information (such as client ids and signatures) permanently. By default $XDG_CACHE_HOME/yt-dlp or ~/.cache/yt-dlp
	 */
	cacheDir?: string | string[]
	/**
	 * @description Disable filesystem caching
	 */
	noCacheDir?: boolean
	/**
	 * @description Delete all filesystem cache files 
	 */
	rmCacheDir?: boolean
	/**
	 * @description Write thumbnail image to disk
	 */
	writeThumbnail?: boolean
	/**
	 * @description Do not write thumbnail image to disk (default)
	 */
	noWriteThumbnail?: boolean
	/**
	 * @description Write all thumbnail image formats to disk
	 */
	writeAllThumbnails?: boolean
	/**
	 * @description List available thumbnails of each video. Simulate unless --no-simulate is used 
	 */
	listThumbnails?: boolean
	/**
	 * @description Write an internet shortcut file, depending on the current platform (.url, .webloc or .desktop). The URL may be cached by the OS
	 */
	writeLink?: boolean
	/**
	 * @description Write a .url Windows internet shortcut. The OS caches the URL based on the file path
	 */
	writeUrlLink?: boolean
	/**
	 * @description Write a .webloc macOS internet shortcut
	 */
	writeWeblocLink?: boolean
	/**
	 * @description Write a .desktop Linux internet shortcut 
	 */
	writeDesktopLink?: boolean
	/**
	 * @description Activate quiet mode. If used with --verbose, print the log to stderr
	 */
	quiet?: boolean
	/**
	 * @description Ignore warnings
	 */
	noWarnings?: boolean
	/**
	 * @description Do not download the video and do not write anything to disk
	 */
	simulate?: boolean
	/**
	 * @description Download the video even if printing/listing options are used
	 */
	noSimulate?: boolean
	/**
	 * @description Ignore "No video formats" error. Useful for extracting metadata even if the videos are not actually available for download (experimental)
	 */
	ignoreNoFormatsError?: boolean
	/**
	 * @description Throw error when no downloadable video formats are found (default)
	 */
	noIgnoreNoFormatsError?: boolean
	/**
	 * @description Do not download the video but write all related files (Alias: --no-download)
	 */
	skipDownload?: boolean
	/**
	 * @description Field name or output template to print to screen, optionally prefixed with when to print it, separated by a ":". Supported values of "WHEN" are the same as that of --use-postprocessor, and "video" (default). Implies --quiet and --simulate (unless --no-simulate is used). This option can be used multiple times
	 */
	print?: string | string[]
	/**
	 * @description  Append given template to the file. The values of WHEN and TEMPLATE are same as that of --print. FILE uses the same syntax as the output template. This option can be used multiple times
	 */
	printToFile?: string | string[]
	/**
	 * @description Quiet, but print JSON information for each video. Simulate unless --no-simulate is used. See "OUTPUT TEMPLATE" for a description of available keys
	 */
	dumpJson?: boolean
	/**
	 * @description Quiet, but print JSON information for each url or infojson passed. Simulate unless --no-simulate is used. If the URL refers to a playlist, the whole playlist information is dumped in a single line
	 */
	dumpSingleJson?: boolean
	/**
	 * @description Force download archive entries to be written as far as no errors occur, even if -s or another simulation option is used (Alias: --force-download-archive)
	 */
	forceWriteArchive?: boolean
	/**
	 * @description Output progress bar as new lines
	 */
	newline?: boolean
	/**
	 * @description Do not print progress bar
	 */
	noProgress?: boolean
	/**
	 * @description Show progress bar, even if in quiet mode
	 */
	progress?: boolean
	/**
	 * @description Display progress in console titlebar
	 */
	consoleTitle?: boolean
	/**
	 * @description  Template for progress outputs, optionally prefixed with one of "download:" (default), "download-title:" (the console title), "postprocess:",  or "postprocess-title:". The video's fields are accessible under the "info" key and the progress attributes are accessible under "progress" key. E.g.: --console-title --progress-template "download- title:%(info.id)s-%(progress.eta)s"
	 */
	progressTemplate?: string | string[]
	/**
	 * @description Print various debugging information
	 */
	verbose?: boolean
	/**
	 * @description Print downloaded pages encoded using base64 to debug problems (very verbose)
	 */
	dumpPages?: boolean
	/**
	 * @description Write downloaded intermediary pages to files in the current directory to debug problems
	 */
	writePages?: boolean
	/**
	 * @description Display sent and read HTTP traffic 
	 */
	printTraffic?: boolean
	/**
	 * @description Force the specified encoding (experimental)
	 */
	encoding?: string | string[]
	/**
	 * @description Explicitly allow HTTPS connection to servers that do not support RFC 5746 secure renegotiation
	 */
	legacyServerConnect?: boolean
	/**
	 * @description Suppress HTTPS certificate validation
	 */
	noCheckCertificates?: boolean
	/**
	 * @description Use an unencrypted connection to retrieve information about the video (Currently supported only for YouTube)
	 */
	preferInsecure?: boolean
	/**
	 * @description Specify a custom user agent
	 */
	userAgent?: string | string[]
	/**
	 * @description Specify a custom referer, use if the video access is restricted to one domain
	 */
	referer?: string | string[]
	/**
	 * @description Specify a custom HTTP header and its value, separated by a colon ":". You can use this option multiple times
	 */
	addHeader?: string | string[]
	/**
	 * @description Work around terminals that lack bidirectional text support. Requires bidiv or fribidi executable in PATH
	 */
	bidiWorkaround?: boolean
	/**
	 * @description Number of seconds to sleep between requests during data extraction
	 */
	sleepRequests?: string | string[]
	/**
	 * @description Number of seconds to sleep before each download. This is the minimum time to sleep when used along with --max-sleep-interval (Alias: --min-sleep-interval)
	 */
	sleepInterval?: string | string[]
	/**
	 * @description Maximum number of seconds to sleep. Can only be used along with --min-sleep- interval
	 */
	maxSleepInterval?: string | string[]
	/**
	 * @description Number of seconds to sleep before each subtitle download 
	 */
	sleepSubtitles?: string | string[]
	/**
	 * @description Video format code, see "FORMAT SELECTION" for more details
	 */
	format?: string | string[]
	/**
	 * @description Sort the formats by the fields given, see "Sorting Formats" for more details
	 */
	formatSort?: string | string[]
	/**
	 * @description Force user specified sort order to have precedence over all fields, see "Sorting Formats" for more details
	 */
	formatSortForce?: boolean
	/**
	 * @description Some fields have precedence over the user specified sort order (default), see "Sorting Formats" for more details
	 */
	noFormatSortForce?: boolean
	/**
	 * @description Allow multiple video streams to be merged into a single file
	 */
	videoMultistreams?: boolean
	/**
	 * @description Only one video stream is downloaded for each output file (default)
	 */
	noVideoMultistreams?: boolean
	/**
	 * @description Allow multiple audio streams to be merged into a single file
	 */
	audioMultistreams?: boolean
	/**
	 * @description Only one audio stream is downloaded for each output file (default)
	 */
	noAudioMultistreams?: boolean
	/**
	 * @description Prefer video formats with free containers over non-free ones of same quality. Use with "-S ext" to strictly prefer free containers irrespective of quality
	 */
	preferFreeFormats?: boolean
	/**
	 * @description Don't give any special preference to free containers (default)
	 */
	noPreferFreeFormats?: boolean
	/**
	 * @description Check that the selected formats are actually downloadable
	 */
	checkFormats?: boolean
	/**
	 * @description Check all formats for whether they are actually downloadable
	 */
	checkAllFormats?: boolean
	/**
	 * @description Do not check that the formats are actually downloadable
	 */
	noCheckFormats?: boolean
	/**
	 * @description List available formats of each video. Simulate unless --no-simulate is used
	 */
	listFormats?: boolean
	/**
	 * @description If a merge is required (e.g. bestvideo+bestaudio), output to given container format. One of mkv, mp4, ogg, webm, flv. Ignored if no merge is required 
	 */
	mergeOutputFormat?: string | string[]
	/**
	 * @description Write subtitle file
	 */
	writeSubs?: boolean
	/**
	 * @description Do not write subtitle file (default)
	 */
	noWriteSubs?: boolean
	/**
	 * @description Write automatically generated subtitle file (Alias: --write-automatic-subs)
	 */
	writeAutoSubs?: boolean
	/**
	 * @description Do not write auto-generated subtitles (default) (Alias: --no-write-automatic- subs)
	 */
	noWriteAutoSubs?: boolean
	/**
	 * @description List available subtitles of each video. Simulate unless --no-simulate is used
	 */
	listSubs?: boolean
	/**
	 * @description Subtitle format, accepts formats preference, for example: "srt" or "ass/srt/best"
	 */
	subFormat?: string | string[]
	/**
	 * @description Languages of the subtitles to download (can be regex) or "all" separated by commas. (Eg: --sub-langs "en.*,ja") You can prefix the language code with a "-" to exempt it from the requested languages. (Eg: --sub- langs all,-live_chat) Use --list-subs for a list of available language tags 
	 */
	subLangs?: string | string[]
	/**
	 * @description Login with this account ID
	 */
	username?: string | string[]
	/**
	 * @description Account password. If this option is left out, yt-dlp will ask interactively
	 */
	password?: string | string[]
	/**
	 * @description Two-factor authentication code
	 */
	twofactor?: string | string[]
	/**
	 * @description Use .netrc authentication data
	 */
	netrc?: boolean
	/**
	 * @description Location of .netrc authentication data; either the path or its containing directory. Defaults to ~/.netrc
	 */
	netrcLocation?: string | string[]
	/**
	 * @description Video password (vimeo, youku)
	 */
	videoPassword?: string | string[]
	/**
	 * @description Adobe Pass multiple-system operator (TV provider) identifier, use --ap-list-mso for a list of available MSOs
	 */
	apMso?: string | string[]
	/**
	 * @description Multiple-system operator account login
	 */
	apUsername?: string | string[]
	/**
	 * @description Multiple-system operator account password. If this option is left out, yt-dlp will ask interactively
	 */
	apPassword?: string | string[]
	/**
	 * @description List all supported multiple-system operators 
	 */
	apListMso?: boolean
	/**
	 * @description Convert video files to audio-only files (requires ffmpeg and ffprobe)
	 */
	extractAudio?: boolean
	/**
	 * @description Specify audio format to convert the audio to when -x is used. Currently supported formats are: best (default) or one of best|aac|flac|mp3|m4a|opus|vorbis|wav|alac
	 */
	audioFormat?: string | string[]
	/**
	 * @description Specify ffmpeg audio quality, insert a value between 0 (best) and 10 (worst) for VBR or a specific bitrate like 128K (default 5)
	 */
	audioQuality?: string | string[]
	/**
	 * @description Remux the video into another container if necessary (currently supported: mp4|mkv|flv |webm|mov|avi|mp3|mka|m4a|ogg|opus). If target container does not support the video/audio codec, remuxing will fail. You can specify multiple rules; Eg. "aac>m4a/mov>mp4/mkv" will remux aac to m4a, mov to mp4 and anything else to mkv.
	 */
	remuxVideo?: string | string[]
	/**
	 * @description Re-encode the video into another format if re-encoding is necessary. The syntax and supported formats are the same as --remux- video
	 */
	recodeVideo?: string | string[]
	/**
	 * @description Give these arguments to the postprocessors. Specify the postprocessor/executable name and the arguments separated by a colon ":" to give the argument to the specified postprocessor/executable. Supported PP are: Merger, ModifyChapters, SplitChapters, ExtractAudio, VideoRemuxer, VideoConvertor, Metadata, EmbedSubtitle, EmbedThumbnail, SubtitlesConvertor, ThumbnailsConvertor, FixupStretched, FixupM4a, FixupM3u8, FixupTimestamp and FixupDuration. The supported executables are: AtomicParsley, FFmpeg and FFprobe. You can also specify "PP+EXE:ARGS" to give the arguments to the specified executable only when being used by the specified postprocessor. Additionally, for ffmpeg/ffprobe, "_i"/"_o" can be appended to the prefix optionally followed by a number to pass the argument before the specified input/output file. Eg: --ppa "Merger+ffmpeg_i1:-v quiet". You can use this option multiple times to give different arguments to different postprocessors. (Alias: --ppa)
	 */
	postprocessorArgs?: string | string[]
	/**
	 * @description Keep the intermediate video file on disk after post-processing
	 */
	keepVideo?: boolean
	/**
	 * @description Delete the intermediate video file after post-processing (default)
	 */
	noKeepVideo?: boolean
	/**
	 * @description Overwrite post-processed files (default)
	 */
	postOverwrites?: boolean
	/**
	 * @description Do not overwrite post-processed files
	 */
	noPostOverwrites?: boolean
	/**
	 * @description Embed subtitles in the video (only for mp4, webm and mkv videos)
	 */
	embedSubs?: boolean
	/**
	 * @description Do not embed subtitles (default)
	 */
	noEmbedSubs?: boolean
	/**
	 * @description Embed thumbnail in the video as cover art
	 */
	embedThumbnail?: boolean
	/**
	 * @description Do not embed thumbnail (default)
	 */
	noEmbedThumbnail?: boolean
	/**
	 * @description Embed metadata to the video file. Also embeds chapters/infojson if present unless --no-embed-chapters/--no-embed-info-json are used (Alias: --add-metadata)
	 */
	embedMetadata?: boolean
	/**
	 * @description Do not add metadata to file (default) (Alias: --no-add-metadata)
	 */
	noEmbedMetadata?: boolean
	/**
	 * @description Add chapter markers to the video file (Alias: --add-chapters)
	 */
	embedChapters?: boolean
	/**
	 * @description Do not add chapter markers (default) (Alias: --no-add-chapters)
	 */
	noEmbedChapters?: boolean
	/**
	 * @description Embed the infojson as an attachment to mkv/mka video files
	 */
	embedInfoJson?: boolean
	/**
	 * @description Do not embed the infojson as an attachment to the video file
	 */
	noEmbedInfoJson?: boolean
	/**
	 * @description Parse additional metadata like title/artist from other fields; see "MODIFYING METADATA" for details
	 */
	parseMetadata?: string | string[]
	/**
	 * @description  Replace text in a metadata field using the given regex. This option can be used multiple times
	 */
	replaceInMetadata?: string | string[]
	/**
	 * @description Write metadata to the video file's xattrs (using dublin core and xdg standards)
	 */
	xattrs?: boolean
	/**
	 * @description Concatenate videos in a playlist. One of "never", "always", or "multi_video" (default; only when the videos form a single show). All the video files must have same codecs and number of streams to be concatable. The "pl_video:" prefix can be used with "--paths" and "--output" to set the output filename for the split files. See "OUTPUT TEMPLATE" for details
	 */
	concatPlaylist?: string | string[]
	/**
	 * @description Automatically correct known faults of the file. One of never (do nothing), warn (only emit a warning), detect_or_warn (the default; fix file if we can, warn otherwise), force (try fixing even if file already exists)
	 */
	fixup?: string | string[]
	/**
	 * @description Location of the ffmpeg binary; either the path to the binary or its containing directory
	 */
	ffmpegLocation?: string | string[]
	/**
	 * @description Execute a command, optionally prefixed with when to execute it (after_move if unspecified), separated by a ":". Supported values of "WHEN" are the same as that of --use-postprocessor. Same syntax as the output template can be used to pass any field as arguments to the command. After download, an additional field "filepath" that contains the final path of the downloaded file is also available, and if no fields are passed, %(filepath)q is appended to the end of the command. This option can be used multiple times
	 */
	exec?: string | string[]
	/**
	 * @description Remove any previously defined --exec
	 */
	noExec?: boolean
	/**
	 * @description Convert the subtitles to another format (currently supported: srt|vtt|ass|lrc) (Alias: --convert-subtitles)
	 */
	convertSubs?: string | string[]
	/**
	 * @description Convert the thumbnails to another format (currently supported: jpg|png)
	 */
	convertThumbnails?: string | string[]
	/**
	 * @description Split video into multiple files based on internal chapters. The "chapter:" prefix can be used with "--paths" and "--output" to set the output filename for the split files. See "OUTPUT TEMPLATE" for details
	 */
	splitChapters?: boolean
	/**
	 * @description Do not split video based on chapters (default)
	 */
	noSplitChapters?: boolean
	/**
	 * @description Remove chapters whose title matches the given regular expression. Time ranges prefixed by a "*" can also be used in place of chapters to remove the specified range. Eg: --remove-chapters "*10:15-15:00" --remove-chapters "intro". This option can be used multiple times
	 */
	removeChapters?: string | string[]
	/**
	 * @description Do not remove any chapters from the file (default)
	 */
	noRemoveChapters?: boolean
	/**
	 * @description Force keyframes around the chapters before removing/splitting them. Requires a re- encode and thus is very slow, but the resulting video may have fewer artifacts around the cuts
	 */
	forceKeyframesAtCuts?: boolean
	/**
	 * @description Do not force keyframes around the chapters when cutting/splitting (default)
	 */
	noForceKeyframesAtCuts?: boolean
	/**
	 * @description The (case sensitive) name of plugin postprocessors to be enabled, and (optionally) arguments to be passed to it, separated by a colon ":". ARGS are a semicolon ";" delimited list of NAME=VALUE. The "when" argument determines when the postprocessor is invoked. It can be one of "pre_process" (after extraction), "before_dl" (before video download), "post_process" (after video download; default), "after_move" (after moving file to their final locations), "after_video" (after downloading and processing all formats of a video), or "playlist" (end of playlist). This option can be used multiple times to add different postprocessors 
	 */
	usePostprocessor?: string | string[]
	/**
	 * @description SponsorBlock categories to create chapters for, separated by commas. Available categories are all, default(=all), sponsor, intro, outro, selfpromo, preview, filler, interaction, music_offtopic, poi_highlight. You can prefix the category with a "-" to exempt it. See [1] for description of the categories. Eg: --sponsorblock-mark all,-preview [1] https://wiki.sponsor.ajay. app/w/Segment_Categories
	 */
	sponsorblockMark?: string | string[]
	/**
	 * @description SponsorBlock categories to be removed from the video file, separated by commas. If a category is present in both mark and remove, remove takes precedence. The syntax and available categories are the same as for --sponsorblock-mark except that "default" refers to "all,-filler" and poi_highlight is not available
	 */
	sponsorblockRemove?: string | string[]
	/**
	 * @description  The title template for SponsorBlock chapters created by --sponsorblock-mark. The same syntax as the output template is used, but the only available fields are start_time, end_time, category, categories, name, category_names. Defaults to "[SponsorBlock]: %(category_names)l"
	 */
	sponsorblockChapterTitle?: string | string[]
	/**
	 * @description Disable both --sponsorblock-mark and --sponsorblock-remove
	 */
	noSponsorblock?: boolean
	/**
	 * @description SponsorBlock API location, defaults to https://sponsor.ajay.app 
	 */
	sponsorblockApi?: string | string[]
	/**
	 * @description Number of retries for known extractor errors (default is 3), or "infinite"
	 */
	extractorRetries?: string | string[]
	/**
	 * @description Process dynamic DASH manifests (default) (Alias: --no-ignore-dynamic-mpd)
	 */
	allowDynamicMpd?: boolean
	/**
	 * @description Do not process dynamic DASH manifests (Alias: --no-allow-dynamic-mpd)
	 */
	ignoreDynamicMpd?: boolean
	/**
	 * @description Split HLS playlists to different formats at discontinuities such as ad breaks
	 */
	hlsSplitDiscontinuity?: boolean
	/**
	 * @description Do not split HLS playlists to different formats at discontinuities such as ad breaks (default)
	 */
	noHlsSplitDiscontinuity?: boolean
}

export function formatOptions(options: Options = {}): string[] {
	const args: string[] = [];
	if (options.help) {
		args.push("--help");
	};

	if (options.version) {
		args.push("--version");
	};

	if (options.update) {
		args.push("--update");
	};

	if (options.ignoreErrors) {
		args.push("--ignore-errors");
	};

	if (options.noAbortOnError) {
		args.push("--no-abort-on-error");
	};

	if (options.abortOnError) {
		args.push("--abort-on-error");
	};

	if (options.dumpUserAgent) {
		args.push("--dump-user-agent");
	};

	if (options.listExtractors) {
		args.push("--list-extractors");
	};

	if (options.extractorDescriptions) {
		args.push("--extractor-descriptions");
	};

	if (options.forceGenericExtractor) {
		args.push("--force-generic-extractor");
	};

	if (options.defaultSearch) {
		args.push("--default-search");
		if (typeof options.defaultSearch === "string") args.push(options.defaultSearch);
		else args.push(...options.defaultSearch);
	};

	if (options.ignoreConfig) {
		args.push("--ignore-config");
	};

	if (options.noConfigLocations) {
		args.push("--no-config-locations");
	};

	if (options.configLocations) {
		args.push("--config-locations");
		if (typeof options.configLocations === "string") args.push(options.configLocations);
		else args.push(...options.configLocations);
	};

	if (options.flatPlaylist) {
		args.push("--flat-playlist");
	};

	if (options.noFlatPlaylist) {
		args.push("--no-flat-playlist");
	};

	if (options.liveFromStart) {
		args.push("--live-from-start");
	};

	if (options.noLiveFromStart) {
		args.push("--no-live-from-start");
	};

	if (options.waitForVideo) {
		args.push("--wait-for-video");
		if (typeof options.waitForVideo === "string") args.push(options.waitForVideo);
		else args.push(...options.waitForVideo);
	};

	if (options.noWaitForVideo) {
		args.push("--no-wait-for-video");
	};

	if (options.markWatched) {
		args.push("--mark-watched");
	};

	if (options.noMarkWatched) {
		args.push("--no-mark-watched");
	};

	if (options.noColors) {
		args.push("--no-colors");
	};

	if (options.compatOptions) {
		args.push("--compat-options");
		if (typeof options.compatOptions === "string") args.push(options.compatOptions);
		else args.push(...options.compatOptions);
	};

	if (options.proxy) {
		args.push("--proxy");
		if (typeof options.proxy === "string") args.push(options.proxy);
		else args.push(...options.proxy);
	};

	if (options.socketTimeout) {
		args.push("--socket-timeout");
		if (typeof options.socketTimeout === "string") args.push(options.socketTimeout);
		else args.push(...options.socketTimeout);
	};

	if (options.sourceAddress) {
		args.push("--source-address");
		if (typeof options.sourceAddress === "string") args.push(options.sourceAddress);
		else args.push(...options.sourceAddress);
	};

	if (options.forceIpv4) {
		args.push("--force-ipv4");
	};

	if (options.forceIpv6) {
		args.push("--force-ipv6");
	};

	if (options.geoVerificationProxy) {
		args.push("--geo-verification-proxy");
		if (typeof options.geoVerificationProxy === "string") args.push(options.geoVerificationProxy);
		else args.push(...options.geoVerificationProxy);
	};

	if (options.geoBypass) {
		args.push("--geo-bypass");
	};

	if (options.noGeoBypass) {
		args.push("--no-geo-bypass");
	};

	if (options.geoBypassCountry) {
		args.push("--geo-bypass-country");
		if (typeof options.geoBypassCountry === "string") args.push(options.geoBypassCountry);
		else args.push(...options.geoBypassCountry);
	};

	if (options.geoBypassIpBlock) {
		args.push("--geo-bypass-ip-block");
		if (typeof options.geoBypassIpBlock === "string") args.push(options.geoBypassIpBlock);
		else args.push(...options.geoBypassIpBlock);
	};

	if (options.playlistStart) {
		args.push("--playlist-start");
		if (typeof options.playlistStart === "string") args.push(options.playlistStart);
		else args.push(...options.playlistStart);
	};

	if (options.playlistEnd) {
		args.push("--playlist-end");
		if (typeof options.playlistEnd === "string") args.push(options.playlistEnd);
		else args.push(...options.playlistEnd);
	};

	if (options.playlistItems) {
		args.push("--playlist-items");
		if (typeof options.playlistItems === "string") args.push(options.playlistItems);
		else args.push(...options.playlistItems);
	};

	if (options.minFilesize) {
		args.push("--min-filesize");
		if (typeof options.minFilesize === "string") args.push(options.minFilesize);
		else args.push(...options.minFilesize);
	};

	if (options.maxFilesize) {
		args.push("--max-filesize");
		if (typeof options.maxFilesize === "string") args.push(options.maxFilesize);
		else args.push(...options.maxFilesize);
	};

	if (options.date) {
		args.push("--date");
		if (typeof options.date === "string") args.push(options.date);
		else args.push(...options.date);
	};

	if (options.datebefore) {
		args.push("--datebefore");
		if (typeof options.datebefore === "string") args.push(options.datebefore);
		else args.push(...options.datebefore);
	};

	if (options.dateafter) {
		args.push("--dateafter");
		if (typeof options.dateafter === "string") args.push(options.dateafter);
		else args.push(...options.dateafter);
	};

	if (options.matchFilter) {
		args.push("--match-filter");
		if (typeof options.matchFilter === "string") args.push(options.matchFilter);
		else args.push(...options.matchFilter);
	};

	if (options.noMatchFilter) {
		args.push("--no-match-filter");
	};

	if (options.noPlaylist) {
		args.push("--no-playlist");
	};

	if (options.yesPlaylist) {
		args.push("--yes-playlist");
	};

	if (options.ageLimit) {
		args.push("--age-limit");
		if (typeof options.ageLimit === "string") args.push(options.ageLimit);
		else args.push(...options.ageLimit);
	};

	if (options.downloadArchive) {
		args.push("--download-archive");
		if (typeof options.downloadArchive === "string") args.push(options.downloadArchive);
		else args.push(...options.downloadArchive);
	};

	if (options.noDownloadArchive) {
		args.push("--no-download-archive");
	};

	if (options.maxDownloads) {
		args.push("--max-downloads");
		if (typeof options.maxDownloads === "string") args.push(options.maxDownloads);
		else args.push(...options.maxDownloads);
	};

	if (options.breakOnExisting) {
		args.push("--break-on-existing");
	};

	if (options.breakOnReject) {
		args.push("--break-on-reject");
	};

	if (options.breakPerInput) {
		args.push("--break-per-input");
	};

	if (options.noBreakPerInput) {
		args.push("--no-break-per-input");
	};

	if (options.skipPlaylistAfterErrors) {
		args.push("--skip-playlist-after-errors");
		if (typeof options.skipPlaylistAfterErrors === "string") args.push(options.skipPlaylistAfterErrors);
		else args.push(...options.skipPlaylistAfterErrors);
	};

	if (options.concurrentFragments) {
		args.push("--concurrent-fragments");
		if (typeof options.concurrentFragments === "string") args.push(options.concurrentFragments);
		else args.push(...options.concurrentFragments);
	};

	if (options.limitRate) {
		args.push("--limit-rate");
		if (typeof options.limitRate === "string") args.push(options.limitRate);
		else args.push(...options.limitRate);
	};

	if (options.throttledRate) {
		args.push("--throttled-rate");
		if (typeof options.throttledRate === "string") args.push(options.throttledRate);
		else args.push(...options.throttledRate);
	};

	if (options.retries) {
		args.push("--retries");
		if (typeof options.retries === "string") args.push(options.retries);
		else args.push(...options.retries);
	};

	if (options.fileAccessRetries) {
		args.push("--file-access-retries");
		if (typeof options.fileAccessRetries === "string") args.push(options.fileAccessRetries);
		else args.push(...options.fileAccessRetries);
	};

	if (options.fragmentRetries) {
		args.push("--fragment-retries");
		if (typeof options.fragmentRetries === "string") args.push(options.fragmentRetries);
		else args.push(...options.fragmentRetries);
	};

	if (options.skipUnavailableFragments) {
		args.push("--skip-unavailable-fragments");
	};

	if (options.abortOnUnavailableFragment) {
		args.push("--abort-on-unavailable-fragment");
		if (typeof options.abortOnUnavailableFragment === "string") args.push(options.abortOnUnavailableFragment);
		else args.push(...options.abortOnUnavailableFragment);
	};

	if (options.keepFragments) {
		args.push("--keep-fragments");
	};

	if (options.noKeepFragments) {
		args.push("--no-keep-fragments");
	};

	if (options.bufferSize) {
		args.push("--buffer-size");
		if (typeof options.bufferSize === "string") args.push(options.bufferSize);
		else args.push(...options.bufferSize);
	};

	if (options.resizeBuffer) {
		args.push("--resize-buffer");
	};

	if (options.noResizeBuffer) {
		args.push("--no-resize-buffer");
	};

	if (options.httpChunkSize) {
		args.push("--http-chunk-size");
		if (typeof options.httpChunkSize === "string") args.push(options.httpChunkSize);
		else args.push(...options.httpChunkSize);
	};

	if (options.playlistReverse) {
		args.push("--playlist-reverse");
	};

	if (options.noPlaylistReverse) {
		args.push("--no-playlist-reverse");
	};

	if (options.playlistRandom) {
		args.push("--playlist-random");
	};

	if (options.xattrSetFilesize) {
		args.push("--xattr-set-filesize");
	};

	if (options.hlsUseMpegts) {
		args.push("--hls-use-mpegts");
	};

	if (options.noHlsUseMpegts) {
		args.push("--no-hls-use-mpegts");
	};

	if (options.downloader) {
		args.push("--downloader");
		if (typeof options.downloader === "string") args.push(options.downloader);
		else args.push(...options.downloader);
	};

	if (options.downloaderArgs) {
		args.push("--downloader-args");
		if (typeof options.downloaderArgs === "string") args.push(options.downloaderArgs);
		else args.push(...options.downloaderArgs);
	};

	if (options.batchFile) {
		args.push("--batch-file");
		if (typeof options.batchFile === "string") args.push(options.batchFile);
		else args.push(...options.batchFile);
	};

	if (options.noBatchFile) {
		args.push("--no-batch-file");
	};

	if (options.paths) {
		args.push("--paths");
		if (typeof options.paths === "string") args.push(options.paths);
		else args.push(...options.paths);
	};

	if (options.output) {
		args.push("--output");
		if (typeof options.output === "string") args.push(options.output);
		else args.push(...options.output);
	};

	if (options.outputNaPlaceholder) {
		args.push("--output-na-placeholder");
		if (typeof options.outputNaPlaceholder === "string") args.push(options.outputNaPlaceholder);
		else args.push(...options.outputNaPlaceholder);
	};

	if (options.restrictFilenames) {
		args.push("--restrict-filenames");
	};

	if (options.noRestrictFilenames) {
		args.push("--no-restrict-filenames");
	};

	if (options.windowsFilenames) {
		args.push("--windows-filenames");
	};

	if (options.noWindowsFilenames) {
		args.push("--no-windows-filenames");
	};

	if (options.trimFilenames) {
		args.push("--trim-filenames");
		if (typeof options.trimFilenames === "string") args.push(options.trimFilenames);
		else args.push(...options.trimFilenames);
	};

	if (options.noOverwrites) {
		args.push("--no-overwrites");
	};

	if (options.forceOverwrites) {
		args.push("--force-overwrites");
	};

	if (options.noForceOverwrites) {
		args.push("--no-force-overwrites");
	};

	if (options.continue) {
		args.push("--continue");
	};

	if (options.noContinue) {
		args.push("--no-continue");
	};

	if (options.part) {
		args.push("--part");
	};

	if (options.noPart) {
		args.push("--no-part");
	};

	if (options.mtime) {
		args.push("--mtime");
	};

	if (options.noMtime) {
		args.push("--no-mtime");
	};

	if (options.writeDescription) {
		args.push("--write-description");
	};

	if (options.noWriteDescription) {
		args.push("--no-write-description");
	};

	if (options.writeInfoJson) {
		args.push("--write-info-json");
	};

	if (options.noWriteInfoJson) {
		args.push("--no-write-info-json");
	};

	if (options.writePlaylistMetafiles) {
		args.push("--write-playlist-metafiles");
	};

	if (options.noWritePlaylistMetafiles) {
		args.push("--no-write-playlist-metafiles");
	};

	if (options.cleanInfojson) {
		args.push("--clean-infojson");
	};

	if (options.noCleanInfojson) {
		args.push("--no-clean-infojson");
	};

	if (options.writeComments) {
		args.push("--write-comments");
	};

	if (options.noWriteComments) {
		args.push("--no-write-comments");
	};

	if (options.loadInfoJson) {
		args.push("--load-info-json");
		if (typeof options.loadInfoJson === "string") args.push(options.loadInfoJson);
		else args.push(...options.loadInfoJson);
	};

	if (options.cookies) {
		args.push("--cookies");
		if (typeof options.cookies === "string") args.push(options.cookies);
		else args.push(...options.cookies);
	};

	if (options.noCookies) {
		args.push("--no-cookies");
	};

	if (options.cookiesFromBrowser) {
		args.push("--cookies-from-browser");
		if (typeof options.cookiesFromBrowser === "string") args.push(options.cookiesFromBrowser);
		else args.push(...options.cookiesFromBrowser);
	};

	if (options.noCookiesFromBrowser) {
		args.push("--no-cookies-from-browser");
	};

	if (options.cacheDir) {
		args.push("--cache-dir");
		if (typeof options.cacheDir === "string") args.push(options.cacheDir);
		else args.push(...options.cacheDir);
	};

	if (options.noCacheDir) {
		args.push("--no-cache-dir");
	};

	if (options.rmCacheDir) {
		args.push("--rm-cache-dir");
	};

	if (options.writeThumbnail) {
		args.push("--write-thumbnail");
	};

	if (options.noWriteThumbnail) {
		args.push("--no-write-thumbnail");
	};

	if (options.writeAllThumbnails) {
		args.push("--write-all-thumbnails");
	};

	if (options.listThumbnails) {
		args.push("--list-thumbnails");
	};

	if (options.writeLink) {
		args.push("--write-link");
	};

	if (options.writeUrlLink) {
		args.push("--write-url-link");
	};

	if (options.writeWeblocLink) {
		args.push("--write-webloc-link");
	};

	if (options.writeDesktopLink) {
		args.push("--write-desktop-link");
	};

	if (options.quiet) {
		args.push("--quiet");
	};

	if (options.noWarnings) {
		args.push("--no-warnings");
	};

	if (options.simulate) {
		args.push("--simulate");
	};

	if (options.noSimulate) {
		args.push("--no-simulate");
	};

	if (options.ignoreNoFormatsError) {
		args.push("--ignore-no-formats-error");
	};

	if (options.noIgnoreNoFormatsError) {
		args.push("--no-ignore-no-formats-error");
	};

	if (options.skipDownload) {
		args.push("--skip-download");
	};

	if (options.print) {
		args.push("--print");
		if (typeof options.print === "string") args.push(options.print);
		else args.push(...options.print);
	};

	if (options.printToFile) {
		args.push("--print-to-file");
		if (typeof options.printToFile === "string") args.push(options.printToFile);
		else args.push(...options.printToFile);
	};

	if (options.dumpJson) {
		args.push("--dump-json");
	};

	if (options.dumpSingleJson) {
		args.push("--dump-single-json");
	};

	if (options.forceWriteArchive) {
		args.push("--force-write-archive");
	};

	if (options.newline) {
		args.push("--newline");
	};

	if (options.noProgress) {
		args.push("--no-progress");
	};

	if (options.progress) {
		args.push("--progress");
	};

	if (options.consoleTitle) {
		args.push("--console-title");
	};

	if (options.progressTemplate) {
		args.push("--progress-template");
		if (typeof options.progressTemplate === "string") args.push(options.progressTemplate);
		else args.push(...options.progressTemplate);
	};

	if (options.verbose) {
		args.push("--verbose");
	};

	if (options.dumpPages) {
		args.push("--dump-pages");
	};

	if (options.writePages) {
		args.push("--write-pages");
	};

	if (options.printTraffic) {
		args.push("--print-traffic");
	};

	if (options.encoding) {
		args.push("--encoding");
		if (typeof options.encoding === "string") args.push(options.encoding);
		else args.push(...options.encoding);
	};

	if (options.legacyServerConnect) {
		args.push("--legacy-server-connect");
	};

	if (options.noCheckCertificates) {
		args.push("--no-check-certificates");
	};

	if (options.preferInsecure) {
		args.push("--prefer-insecure");
	};

	if (options.userAgent) {
		args.push("--user-agent");
		if (typeof options.userAgent === "string") args.push(options.userAgent);
		else args.push(...options.userAgent);
	};

	if (options.referer) {
		args.push("--referer");
		if (typeof options.referer === "string") args.push(options.referer);
		else args.push(...options.referer);
	};

	if (options.addHeader) {
		args.push("--add-header");
		if (typeof options.addHeader === "string") args.push(options.addHeader);
		else args.push(...options.addHeader);
	};

	if (options.bidiWorkaround) {
		args.push("--bidi-workaround");
	};

	if (options.sleepRequests) {
		args.push("--sleep-requests");
		if (typeof options.sleepRequests === "string") args.push(options.sleepRequests);
		else args.push(...options.sleepRequests);
	};

	if (options.sleepInterval) {
		args.push("--sleep-interval");
		if (typeof options.sleepInterval === "string") args.push(options.sleepInterval);
		else args.push(...options.sleepInterval);
	};

	if (options.maxSleepInterval) {
		args.push("--max-sleep-interval");
		if (typeof options.maxSleepInterval === "string") args.push(options.maxSleepInterval);
		else args.push(...options.maxSleepInterval);
	};

	if (options.sleepSubtitles) {
		args.push("--sleep-subtitles");
		if (typeof options.sleepSubtitles === "string") args.push(options.sleepSubtitles);
		else args.push(...options.sleepSubtitles);
	};

	if (options.format) {
		args.push("--format");
		if (typeof options.format === "string") args.push(options.format);
		else args.push(...options.format);
	};

	if (options.formatSort) {
		args.push("--format-sort");
		if (typeof options.formatSort === "string") args.push(options.formatSort);
		else args.push(...options.formatSort);
	};

	if (options.formatSortForce) {
		args.push("--format-sort-force");
	};

	if (options.noFormatSortForce) {
		args.push("--no-format-sort-force");
	};

	if (options.videoMultistreams) {
		args.push("--video-multistreams");
	};

	if (options.noVideoMultistreams) {
		args.push("--no-video-multistreams");
	};

	if (options.audioMultistreams) {
		args.push("--audio-multistreams");
	};

	if (options.noAudioMultistreams) {
		args.push("--no-audio-multistreams");
	};

	if (options.preferFreeFormats) {
		args.push("--prefer-free-formats");
	};

	if (options.noPreferFreeFormats) {
		args.push("--no-prefer-free-formats");
	};

	if (options.checkFormats) {
		args.push("--check-formats");
	};

	if (options.checkAllFormats) {
		args.push("--check-all-formats");
	};

	if (options.noCheckFormats) {
		args.push("--no-check-formats");
	};

	if (options.listFormats) {
		args.push("--list-formats");
	};

	if (options.mergeOutputFormat) {
		args.push("--merge-output-format");
		if (typeof options.mergeOutputFormat === "string") args.push(options.mergeOutputFormat);
		else args.push(...options.mergeOutputFormat);
	};

	if (options.writeSubs) {
		args.push("--write-subs");
	};

	if (options.noWriteSubs) {
		args.push("--no-write-subs");
	};

	if (options.writeAutoSubs) {
		args.push("--write-auto-subs");
	};

	if (options.noWriteAutoSubs) {
		args.push("--no-write-auto-subs");
	};

	if (options.listSubs) {
		args.push("--list-subs");
	};

	if (options.subFormat) {
		args.push("--sub-format");
		if (typeof options.subFormat === "string") args.push(options.subFormat);
		else args.push(...options.subFormat);
	};

	if (options.subLangs) {
		args.push("--sub-langs");
		if (typeof options.subLangs === "string") args.push(options.subLangs);
		else args.push(...options.subLangs);
	};

	if (options.username) {
		args.push("--username");
		if (typeof options.username === "string") args.push(options.username);
		else args.push(...options.username);
	};

	if (options.password) {
		args.push("--password");
		if (typeof options.password === "string") args.push(options.password);
		else args.push(...options.password);
	};

	if (options.twofactor) {
		args.push("--twofactor");
		if (typeof options.twofactor === "string") args.push(options.twofactor);
		else args.push(...options.twofactor);
	};

	if (options.netrc) {
		args.push("--netrc");
	};

	if (options.netrcLocation) {
		args.push("--netrc-location");
		if (typeof options.netrcLocation === "string") args.push(options.netrcLocation);
		else args.push(...options.netrcLocation);
	};

	if (options.videoPassword) {
		args.push("--video-password");
		if (typeof options.videoPassword === "string") args.push(options.videoPassword);
		else args.push(...options.videoPassword);
	};

	if (options.apMso) {
		args.push("--ap-mso");
		if (typeof options.apMso === "string") args.push(options.apMso);
		else args.push(...options.apMso);
	};

	if (options.apUsername) {
		args.push("--ap-username");
		if (typeof options.apUsername === "string") args.push(options.apUsername);
		else args.push(...options.apUsername);
	};

	if (options.apPassword) {
		args.push("--ap-password");
		if (typeof options.apPassword === "string") args.push(options.apPassword);
		else args.push(...options.apPassword);
	};

	if (options.apListMso) {
		args.push("--ap-list-mso");
	};

	if (options.extractAudio) {
		args.push("--extract-audio");
	};

	if (options.audioFormat) {
		args.push("--audio-format");
		if (typeof options.audioFormat === "string") args.push(options.audioFormat);
		else args.push(...options.audioFormat);
	};

	if (options.audioQuality) {
		args.push("--audio-quality");
		if (typeof options.audioQuality === "string") args.push(options.audioQuality);
		else args.push(...options.audioQuality);
	};

	if (options.remuxVideo) {
		args.push("--remux-video");
		if (typeof options.remuxVideo === "string") args.push(options.remuxVideo);
		else args.push(...options.remuxVideo);
	};

	if (options.recodeVideo) {
		args.push("--recode-video");
		if (typeof options.recodeVideo === "string") args.push(options.recodeVideo);
		else args.push(...options.recodeVideo);
	};

	if (options.postprocessorArgs) {
		args.push("--postprocessor-args");
		if (typeof options.postprocessorArgs === "string") args.push(options.postprocessorArgs);
		else args.push(...options.postprocessorArgs);
	};

	if (options.keepVideo) {
		args.push("--keep-video");
	};

	if (options.noKeepVideo) {
		args.push("--no-keep-video");
	};

	if (options.postOverwrites) {
		args.push("--post-overwrites");
	};

	if (options.noPostOverwrites) {
		args.push("--no-post-overwrites");
	};

	if (options.embedSubs) {
		args.push("--embed-subs");
	};

	if (options.noEmbedSubs) {
		args.push("--no-embed-subs");
	};

	if (options.embedThumbnail) {
		args.push("--embed-thumbnail");
	};

	if (options.noEmbedThumbnail) {
		args.push("--no-embed-thumbnail");
	};

	if (options.embedMetadata) {
		args.push("--embed-metadata");
	};

	if (options.noEmbedMetadata) {
		args.push("--no-embed-metadata");
	};

	if (options.embedChapters) {
		args.push("--embed-chapters");
	};

	if (options.noEmbedChapters) {
		args.push("--no-embed-chapters");
	};

	if (options.embedInfoJson) {
		args.push("--embed-info-json");
	};

	if (options.noEmbedInfoJson) {
		args.push("--no-embed-info-json");
	};

	if (options.parseMetadata) {
		args.push("--parse-metadata");
		if (typeof options.parseMetadata === "string") args.push(options.parseMetadata);
		else args.push(...options.parseMetadata);
	};

	if (options.replaceInMetadata) {
		args.push("--replace-in-metadata");
		if (typeof options.replaceInMetadata === "string") args.push(options.replaceInMetadata);
		else args.push(...options.replaceInMetadata);
	};

	if (options.xattrs) {
		args.push("--xattrs");
	};

	if (options.concatPlaylist) {
		args.push("--concat-playlist");
		if (typeof options.concatPlaylist === "string") args.push(options.concatPlaylist);
		else args.push(...options.concatPlaylist);
	};

	if (options.fixup) {
		args.push("--fixup");
		if (typeof options.fixup === "string") args.push(options.fixup);
		else args.push(...options.fixup);
	};

	if (options.ffmpegLocation) {
		args.push("--ffmpeg-location");
		if (typeof options.ffmpegLocation === "string") args.push(options.ffmpegLocation);
		else args.push(...options.ffmpegLocation);
	};

	if (options.exec) {
		args.push("--exec");
		if (typeof options.exec === "string") args.push(options.exec);
		else args.push(...options.exec);
	};

	if (options.noExec) {
		args.push("--no-exec");
	};

	if (options.convertSubs) {
		args.push("--convert-subs");
		if (typeof options.convertSubs === "string") args.push(options.convertSubs);
		else args.push(...options.convertSubs);
	};

	if (options.convertThumbnails) {
		args.push("--convert-thumbnails");
		if (typeof options.convertThumbnails === "string") args.push(options.convertThumbnails);
		else args.push(...options.convertThumbnails);
	};

	if (options.splitChapters) {
		args.push("--split-chapters");
	};

	if (options.noSplitChapters) {
		args.push("--no-split-chapters");
	};

	if (options.removeChapters) {
		args.push("--remove-chapters");
		if (typeof options.removeChapters === "string") args.push(options.removeChapters);
		else args.push(...options.removeChapters);
	};

	if (options.noRemoveChapters) {
		args.push("--no-remove-chapters");
	};

	if (options.forceKeyframesAtCuts) {
		args.push("--force-keyframes-at-cuts");
	};

	if (options.noForceKeyframesAtCuts) {
		args.push("--no-force-keyframes-at-cuts");
	};

	if (options.usePostprocessor) {
		args.push("--use-postprocessor");
		if (typeof options.usePostprocessor === "string") args.push(options.usePostprocessor);
		else args.push(...options.usePostprocessor);
	};

	if (options.sponsorblockMark) {
		args.push("--sponsorblock-mark");
		if (typeof options.sponsorblockMark === "string") args.push(options.sponsorblockMark);
		else args.push(...options.sponsorblockMark);
	};

	if (options.sponsorblockRemove) {
		args.push("--sponsorblock-remove");
		if (typeof options.sponsorblockRemove === "string") args.push(options.sponsorblockRemove);
		else args.push(...options.sponsorblockRemove);
	};

	if (options.sponsorblockChapterTitle) {
		args.push("--sponsorblock-chapter-title");
		if (typeof options.sponsorblockChapterTitle === "string") args.push(options.sponsorblockChapterTitle);
		else args.push(...options.sponsorblockChapterTitle);
	};

	if (options.noSponsorblock) {
		args.push("--no-sponsorblock");
	};

	if (options.sponsorblockApi) {
		args.push("--sponsorblock-api");
		if (typeof options.sponsorblockApi === "string") args.push(options.sponsorblockApi);
		else args.push(...options.sponsorblockApi);
	};

	if (options.extractorRetries) {
		args.push("--extractor-retries");
		if (typeof options.extractorRetries === "string") args.push(options.extractorRetries);
		else args.push(...options.extractorRetries);
	};

	if (options.allowDynamicMpd) {
		args.push("--allow-dynamic-mpd");
	};

	if (options.ignoreDynamicMpd) {
		args.push("--ignore-dynamic-mpd");
	};

	if (options.hlsSplitDiscontinuity) {
		args.push("--hls-split-discontinuity");
	};

	if (options.noHlsSplitDiscontinuity) {
		args.push("--no-hls-split-discontinuity");
	};

	return args;
}

export function ytdlp(url: string, options: Options = {}): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(ytdlpPath + " " + url + " " + formatOptions(options).join(" "), (error, stdout, stderr) => {
			if (error) return reject(error);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
}

export function ytdlpSync(url: string, options: Options = {}): string {
	return execSync(ytdlpPath + " " + url + " " + formatOptions(options).join(" ")).toString();
}

export function ytdlpStream(url: string, options: Options = {}): ReturnType<typeof spawn> {
	return spawn(ytdlpPath, [url, ...formatOptions(options)]);
}
