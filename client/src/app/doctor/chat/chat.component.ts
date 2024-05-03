import { CommonModule } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  chats: WritableSignal<{ text: string; position: string }[]> = signal([
    { text: 'Hello', position: 'left' },
  ]);
  show: WritableSignal<boolean> = signal(false);

  async addChat(text: string) {
    this.chats.set([...this.chats(), { text, position: 'right' }]);
    const result: {
      text: string;
      web_search_sources: {
        link: string;
        title: string;
        hostname: string;
      }[];
    } = await (
      await fetch('https://vp9ddzj8yc6479-5000.proxy.runpod.net/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'dontshare',
          input: text,
        }),
      })
    ).json();

    const resultText = result.text;

    // for (const webSource of result.web_search_sources) {
    //   resultText += `\n\n${webSource.link}:${webSource.title}:${webSource.hostname}`;
    // }

    this.chats.set([...this.chats(), { text: resultText, position: 'left' }]);
  }
}
