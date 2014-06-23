# This file is part of Buildbot.  Buildbot is free software: you can
# redistribute it and/or modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation, version 2.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
# details.
#
# You should have received a copy of the GNU General Public License along with
# this program; if not, write to the Free Software Foundation, Inc., 51
# Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Copyright Buildbot Team Members

from twisted.web.util import redirectTo
from twisted.internet import defer

from buildbot.status.web.base import HtmlResource, path_to_authzfail
from buildbot.util.eventual import eventually

class BranchComparisonResource(HtmlResource):
    pageTitle = "Katana"

    @defer.inlineCallbacks
    def content(self, request, cxt):
        status = self.getStatus(request)

        res = yield self.getAuthz(request).actionAllowed("cleanShutdown",
                                                            request)

        if request.path == '/shutdown':
            if res:
                eventually(status.cleanShutdown)
                defer.returnValue(redirectTo("/", request))
                return
            else:
                defer.returnValue(
                        redirectTo(path_to_authzfail(request), request))
                return
        elif request.path == '/cancel_shutdown':
            if res:
                eventually(status.cancelCleanShutdown)
                defer.returnValue(redirectTo("/", request))
                return
            else:
                defer.returnValue(
                        redirectTo(path_to_authzfail(request), request))
                return

        # Pending builds
        db = status.master.db
        pending_builds = yield db.buildrequests.getBuildRequests(claimed=False)

        builders = set()
        for bname in status.getBuilderNames():
            builders.add(status.getBuilder(bname))

        # Current builds
        current_builds = set()
        for b in builders:
            current_builds |= set(b.getCurrentBuilds())

        cxt.update(
                shutting_down = status.shuttingDown,
                shutdown_url = request.childLink("shutdown"),
                cancel_shutdown_url = request.childLink("cancel_shutdown"),
                slaves = status.getSlaveNames(),
                pending_builds = pending_builds,
                current_builds = current_builds
                )
        template = request.site.buildbot_service.templates.get_template("branch_comparison.html")
        defer.returnValue(template.render(**cxt))
