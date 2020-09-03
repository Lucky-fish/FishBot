const profile = {
    enabled: true,
    start: function(label) {
        if (!this.enabled) {
            return {};
        }

        return {
            startTime: new Date().getTime(),
            label: label
        }
    },
    end: function(session) {
        if (!this.enabled) {
            return;
        }

        console.log(session.label + " used " + (new Date().getTime() - session.startTime) + "ms");
    }
};

module.exports = profile;
