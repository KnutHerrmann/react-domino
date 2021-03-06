this.workbox = this.workbox || {};
this.workbox.streams = (function (logger_mjs,assert_mjs) {
'use strict';

try {
  self.workbox.v['workbox:streams:3.2.0'] = 1;
} catch (e) {} // eslint-disable-line

/*
 Copyright 2018 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * Takes either a Response, a ReadableStream, or a
 * [BodyInit](https://fetch.spec.whatwg.org/#bodyinit) and returns the
 * ReadableStreamReader object associated with it.
 *
 * @param {workbox.streams.StreamSource} source
 * @return {ReadableStreamReader}
 * @private
 */
function _getReaderFromSource(source) {
  if (source.body && source.body.getReader) {
    return source.body.getReader();
  }

  if (source.getReader) {
    return source.getReader();
  }

  // TODO: This should be possible to do by constructing a ReadableStream, but
  // I can't get it to work. As a hack, construct a new Response, and use the
  // reader associated with its body.
  return new Response(source).body.getReader();
}

/**
 * Takes multiple source Promises, each of which could resolve to a Response, a
 * ReadableStream, or a [BodyInit](https://fetch.spec.whatwg.org/#bodyinit).
 *
 * Returns an object exposing a ReadableStream with each individual stream's
 * data returned in sequence, along with a Promise which signals when the
 * stream is finished (useful for passing to a FetchEvent's waitUntil()).
 *
 * @param {Array<Promise<workbox.streams.StreamSource>>} sourcePromises
 * @return {Object<{done: Promise, stream: ReadableStream}>}
 *
 * @memberof workbox.streams
 */
function concatenate(sourcePromises) {
  {
    assert_mjs.assert.isArray(sourcePromises, {
      moduleName: 'workbox-streams',
      funcName: 'concatenate',
      paramName: 'sourcePromises'
    });
  }

  const readerPromises = sourcePromises.map(sourcePromise => {
    return Promise.resolve(sourcePromise).then(source => {
      return _getReaderFromSource(source);
    });
  });

  let fullyStreamedResolve;
  let fullyStreamedReject;
  const done = new Promise((resolve, reject) => {
    fullyStreamedResolve = resolve;
    fullyStreamedReject = reject;
  });

  let i = 0;
  const logMessages = [];
  const stream = new ReadableStream({
    pull(controller) {
      return readerPromises[i].then(reader => reader.read()).then(result => {
        if (result.done) {
          {
            logMessages.push(['Reached the end of source:', sourcePromises[i]]);
          }

          i++;
          if (i >= readerPromises.length) {
            // Log all the messages in the group at once in a single group.
            {
              logger_mjs.logger.groupCollapsed(`Concatenating ${readerPromises.length} sources.`);
              for (const message of logMessages) {
                if (Array.isArray(message)) {
                  logger_mjs.logger.log(...message);
                } else {
                  logger_mjs.logger.log(message);
                }
              }
              logger_mjs.logger.log('Finished reading all sources.');
              logger_mjs.logger.groupEnd();
            }

            controller.close();
            fullyStreamedResolve();
            return;
          }

          return this.pull(controller);
        } else {
          controller.enqueue(result.value);
        }
      }).catch(error => {
        {
          logger_mjs.logger.error('An error occurred:', error);
        }
        fullyStreamedReject(error);
        throw error;
      });
    },

    cancel() {
      {
        logger_mjs.logger.warn('The ReadableStream was cancelled.');
      }

      fullyStreamedResolve();
    }
  });

  return { done, stream };
}

/*
 Copyright 2018 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * This is a utility method that determines whether the current browser supports
 * the features required to create streamed responses. Currently, it checks if
 * [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * is available.
 *
 * @param {HeadersInit} [headersInit] If there's no `Content-Type` specified,
 * `'text/html'` will be used by default.
 * @return {boolean} `true`, if the current browser meets the requirements for
 * streaming responses, and `false` otherwise.
 *
 * @memberof workbox.streams
 */
function createHeaders(headersInit = {}) {
  // See https://github.com/GoogleChrome/workbox/issues/1461
  const headers = new Headers(headersInit);
  if (!headers.has('content-type')) {
    headers.set('content-type', 'text/html');
  }
  return headers;
}

/*
 Copyright 2018 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * Takes multiple source Promises, each of which could resolve to a Response, a
 * ReadableStream, or a [BodyInit](https://fetch.spec.whatwg.org/#bodyinit),
 * along with a
 * [HeadersInit](https://fetch.spec.whatwg.org/#typedefdef-headersinit).
 *
 * Returns an object exposing a Response whose body consists of each individual
 * stream's data returned in sequence, along with a Promise which signals when
 * the stream is finished (useful for passing to a FetchEvent's waitUntil()).
 *
 * @param {Array<Promise<workbox.streams.StreamSource>>} sourcePromises
 * @param {HeadersInit} [headersInit] If there's no `Content-Type` specified,
 * `'text/html'` will be used by default.
 * @return {Object<{done: Promise, response: Response}>}
 *
 * @memberof workbox.streams
 */
function concatenateToResponse(sourcePromises, headersInit) {
  const { done, stream } = concatenate(sourcePromises);

  const headers = createHeaders(headersInit);
  const response = new Response(stream, { headers });

  return { done, response };
}

/*
 Copyright 2018 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * This is a utility method that determines whether the current browser supports
 * the features required to create streamed responses. Currently, it checks if
 * [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * is available.
 *
 * @return {boolean} `true`, if the current browser meets the requirements for
 * streaming responses, and `false` otherwise.
 *
 * @memberof workbox.streams
 */
function isSupported() {
  return 'ReadableStream' in self;
}

/*
  Copyright 2018 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var publicAPI = Object.freeze({
	concatenate: concatenate,
	concatenateToResponse: concatenateToResponse,
	isSupported: isSupported
});

/*
 Copyright 2018 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * A shortcut to create a strategy that could be dropped-in to Workbox's router.
 *
 * On browsers that do not support constructing new `ReadableStream`s, this
 * strategy will automatically wait for all the `sourceFunctions` to complete,
 * and create a final response that concatenates their values together.
 *
 * @param {
 *   Array<function(workbox.routing.Route~handlerCallback)>} sourceFunctions
 * Each function should return a {@link workbox.streams.StreamSource} (or a
 * Promise which resolves to one).
 * @param {HeadersInit} [headersInit] If there's no `Content-Type` specified,
 * `'text/html'` will be used by default.
 * @return {workbox.routing.Route~handlerCallback}
 *
 * @memberof workbox.streams
 */
function strategy(sourceFunctions, headersInit) {
  return (() => {
    var _ref = babelHelpers.asyncToGenerator(function* ({ event, url, params }) {
      if (isSupported()) {
        const { done, response } = concatenateToResponse(sourceFunctions.map(function (sourceFunction) {
          return sourceFunction({ event, url, params });
        }), headersInit);
        event.waitUntil(done);
        return response;
      }

      {
        logger_mjs.logger.log(`The current browser doesn't support creating response ` + `streams. Falling back to non-streaming response instead.`);
      }

      // Fallback to waiting for everything to finish, and concatenating the
      // responses.
      const parts = yield Promise.all(sourceFunctions.map(function (sourceFunction) {
        return sourceFunction({ event, url, params });
      }).map((() => {
        var _ref2 = babelHelpers.asyncToGenerator(function* (responsePromise) {
          const response = yield responsePromise;
          if (response instanceof Response) {
            return response.blob();
          }

          // Otherwise, assume it's something like a string which can be used
          // as-is when constructing the final composite blob.
          return response;
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })()));

      const headers = createHeaders(headersInit);
      // Constructing a new Response from a Blob source is well-supported.
      // So is constructing a new Blob from multiple source Blobs or strings.
      return new Response(new Blob(parts), { headers });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();
}

var defaultExport = {
  concatenate,
  concatenateToResponse,
  isSupported,
  strategy
};

/*
  Copyright 2018 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const finalExport = Object.assign(defaultExport, publicAPI);

return finalExport;

}(workbox.core._private,workbox.core._private));

//# sourceMappingURL=workbox-streams.dev.js.map
