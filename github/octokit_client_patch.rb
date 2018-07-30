# frozen_string_literal: true

require "octokit"
#
# ---------------------------------------------------------------------------------------
# TODO: Remove this patch-file once the `octokit` gem ships with methods to send requests
#       to the Checks API endpoints.
# ---------------------------------------------------------------------------------------
#
module Octokit
  class Client
    # Required to access the Checks API during the preview period
    PREVIEW_HEADER = {
      :headers => {
        "Accept" => "application/vnd.github.antiope-preview+json"
      }
    }

    # -----------------------------------------------------------------------------------
    # Note: The following methods have been fashioned along the lines of existing methods
    #       included in Octokit::Client to allow smoother transition to the gem.
    # -----------------------------------------------------------------------------------

    # Create a new check run
    # Use when the app intercepts either a `check_suite` event with a `requested` action
    #   or a `check_run` event with a `rerequested` action.
    #
    #      repo: [STRING] The repository name in the 'name_with_owner' pattern.
    #   options: [HASH]   The customizable payload sent along with the request.
    #
    # -----------------------------------------------------------------------------------
    # https://developer.github.com/v3/checks/runs/#create-a-check-run
    # -----------------------------------------------------------------------------------
    def create_check_run(repo, options)
      post "#{Repository.path repo}/check-runs", options.merge(PREVIEW_HEADER)
    end

    # Update an existing check run
    # Use to update the status of a check run (e.g. to `completed`) or with any new
    #   information available from the underlying test run or to simply mark the check
    #   run as `success`, `failure`, etc.
    #
    #      repo: [STRING]  The repository name in the 'name_with_owner' pattern.
    #        id: [INTEGER] The id of the check run to be modified.
    #   options: [HASH]    The customizable payload sent along with the request.
    #
    # -----------------------------------------------------------------------------------
    # https://developer.github.com/v3/checks/runs/#update-a-check-run
    # -----------------------------------------------------------------------------------
    def update_check_run(repo, id, options)
      patch "#{Repository.path repo}/check-runs/#{id}", options.merge(PREVIEW_HEADER)
    end
  end
end
