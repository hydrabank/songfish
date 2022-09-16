# Reference document for administrators

### Override Codes (ECs)
Override or "emergency" codes are used to change the behaviour of the bot and override its' production behaviours. Only administrators are able to use these override codes.

Override codes can be activated by entering the override code into the `ec` subcommand of `swissknife`.

#### List of EC overrides

- `vaporwave[:0-100]` - If currently in a voice chat with the bot, using `vaporwave:[0-100]` will configure the server's current player session to use the vaporwave filter from an intensity of 0 to 100. If the EC `vaporwave` is used without an input number, it will output the current intensity of the vaporwave filter.

- `nightcore:[true/false]` - If currently in a voice chat with the bot, using `nightcore:[true/false]` will configure the server's current player session to use the nightcore filter. If the EC `nightcore` is used without a boolean, it will output the current boolean state of the filter (similar to Vaporwave).

- `test`: This EC is mainly used in development to test new modals and buttons. This may change at any time.