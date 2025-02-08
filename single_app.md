sequenceDiagram
    loop javascript
    Browser->>Browser: begin sending note method, from form to js function
    end
    loop javascript
    Browser->>Browser: catch with eventListener, preventing the default
    end
    loop javascript
    Browser->>Browser: add to list in the browser state
    end
    loop javascript
    Browser->>Browser: redraw in front
    end
    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of Browser: The browser sends to the server to save after processing and rerendering the value in the front
