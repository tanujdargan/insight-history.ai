import { MessageResponse } from '../types/messages';

export async function sendMessageWithTimeout<T>(
  message: any,
  timeout: number = 5000
): Promise<MessageResponse<T>> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Message timeout'));
    }, timeout);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timeoutId);
      
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      
      resolve(response);
    });
  });
}