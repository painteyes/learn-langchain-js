import './style.css';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

try {
    const result = await fetch('/data/knowledge_base.txt');
    const text = await result.text();

    const splitter = new RecursiveCharacterTextSplitter();
    const output = await splitter.createDocuments([text]);

    createHTML(output);
} catch(err) {
    console.error(err);
}

function createHTML(arrayList) {

    arrayList.forEach(chunck => {
        let content = chunck.pageContent;
        let metaData = chunck.metadata;

        const div = document.createElement("div");
        let h2 = document.createElement("h2");
        let h4 = document.createElement("h4");
        let p = document.createElement("p");

        h2.textContent = content.split('**')[1];
        h4.textContent = JSON.stringify(metaData);
        p.textContent = content;

        div.append(h4);
        div.append(h2);
        div.append(p);

        h2.className = "mb-2 text-2xl font-bold text-gray-900";
        h4.className = "mb-2 text-gray-900";
        div.className = "m-3 p-6 bg-white border border-gray-200 rounded-lg shadow"

        document.body.append(div);
    });
}