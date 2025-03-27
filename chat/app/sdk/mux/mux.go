package mux

import (
	"context"
	"net/http"

	"github.com/mihailtudos/chat-app/chat/app/domain/chatapp"
	"github.com/mihailtudos/chat-app/chat/app/sdk/mid"
	"github.com/mihailtudos/chat-app/chat/foundation/logger"
	"github.com/mihailtudos/chat-app/chat/foundation/web"
)

type Config struct {
	Log *logger.Logger
}

func WebApi(cfg Config) http.Handler {
	logger := func(ctx context.Context, msg string, args ...any) {
		cfg.Log.Info(ctx, msg, args...)
	}

	app := web.NewApp(
		logger,
		mid.Logger(cfg.Log),
		mid.Errors(cfg.Log),
		mid.Panics(),
	)

	chatapp.Routes(app)

	return app
}
