package chatapp

import (
	"net/http"

	"github.com/mihailtudos/chat-app/chat/foundation/web"
)

func Routes(app *web.App) {
	api := newApp()

	app.HandlerFunc(http.MethodGet, "", "/test", api.test) 
}
