import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization', 'X-LW-UAKS'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

function getRedactedOAuthResponse() {
  return {
    token: '[REDACTED]',
    expiresAt: 9999,
  };
}

function redact(entry): void {
  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  if (!entry.response.content.text) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  //we can just get rid of all response content if this was the token call
  const requestUrl = entry.request.url;
  if (requestUrl.includes('/access/tokens')) {
    entry.response.content.text = JSON.stringify(getRedactedOAuthResponse());
    return;
  }

  //if it wasn't a token call, parse the response text, removing any carriage returns or newlines
  const responseText = entry.response.content.text;
  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  //now we can modify the returned object as desired
  if (parsedResponseText) {
    if (Array.isArray(parsedResponseText)) {
      for (const element of parsedResponseText) {
        if (element.info && element.info.datacenters) {
          element.info.datacenters = element.info.datacenters.map(
            (datacenter) => ({
              ...datacenter,
              secureBundleUrl: '[REDACTED]',
              secureBundleInternalUrl: '[REDACTED]',
              secureBundleMigrationProxyUrl: '[REDACTED]',
              secureBundleMigrationProxyInternalUrl: '[REDACTED]',
            }),
          );
        }
      }
    }
  }

  entry.response.content.text = JSON.stringify(parsedResponseText);
}
